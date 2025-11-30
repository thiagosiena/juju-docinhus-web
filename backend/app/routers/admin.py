# app/routers/admin.py
from datetime import datetime, timedelta
from typing import List, Optional, Literal
from sqlalchemy.exc import IntegrityError
from fastapi import Response
import base64

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session, joinedload

from ..database import SessionLocal
from .. import models
from .. import schemas

router = APIRouter(prefix="/admin", tags=["admin"])

# Dependência de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

SECRET_KEY = "chavehipermegasuperultramentesecretaamaissecretadetodas"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def get_admin_by_username(db: Session, username: str) -> Optional[models.Admin]:
    return db.query(models.Admin).filter(models.Admin.username == username).first()

def authenticate_admin(db: Session, username: str, password: str) -> Optional[models.Admin]:
    admin = get_admin_by_username(db, username)
    if not admin:
        return None
    if not verify_password(password, admin.hashed_password):
        return None
    return admin

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.Admin:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não autenticado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    admin = get_admin_by_username(db, username=username)
    if admin is None:
        raise credentials_exception
    return admin

@router.post("/login", response_model=schemas.Token)
def login_admin(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    admin = authenticate_admin(db, form_data.username, form_data.password)
    if not admin:
        raise HTTPException(status_code=400, detail="Usuário ou senha inválidos")

    access_token = create_access_token(data={"sub": admin.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/produtos", response_model=schemas.ProdutoOut)
def criar_produto(
    prod_in: schemas.ProdutoCreate,
    db: Session = Depends(get_db),
    admin: models.Admin = Depends(get_current_admin),
):
    categoria = (
        db.query(models.Categoria)
        .filter(models.Categoria.id == prod_in.categoria_id)
        .first()
    )
    if not categoria:
        raise HTTPException(status_code=400, detail="Categoria inválida")

    imagem_bytes = None
    if prod_in.imagem_base64:
        try:
            imagem_bytes = base64.b64decode(prod_in.imagem_base64)
        except Exception:
            raise HTTPException(status_code=400, detail="Imagem inválida")

    produto = models.Produto(
        nome=prod_in.nome,
        descricao=prod_in.descricao,
        preco=prod_in.preco,
        categoria_id=prod_in.categoria_id,
        imagem=imagem_bytes,
    )
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto

@router.get("/produtos", response_model=List[schemas.ProdutoOut])
def listar_produtos(
    db: Session = Depends(get_db),
    admin: models.Admin = Depends(get_current_admin),
):
    produtos = db.query(models.Produto).all()
    return produtos

@router.put("/produtos/{produto_id}", response_model=schemas.ProdutoOut)
def atualizar_produto(
    produto_id: int,
    prod_in: schemas.ProdutoUpdate,
    db: Session = Depends(get_db),
    admin: models.Admin = Depends(get_current_admin),
):
    produto = (
        db.query(models.Produto)
        .filter(models.Produto.id == produto_id)
        .first()
    )
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    if prod_in.nome is not None:
        produto.nome = prod_in.nome
    if prod_in.descricao is not None:
        produto.descricao = prod_in.descricao
    if prod_in.preco is not None:
        produto.preco = prod_in.preco
    if prod_in.categoria_id is not None:
        produto.categoria_id = prod_in.categoria_id

    if prod_in.imagem_base64 is not None:
        if prod_in.imagem_base64 == "":
            produto.imagem = None
        else:
            try:
                produto.imagem = base64.b64decode(prod_in.imagem_base64)
            except Exception:
                raise HTTPException(status_code=400, detail="Imagem inválida")

    db.commit()
    db.refresh(produto)
    return produto

@router.delete("/produtos/{produto_id}", status_code=204)
def deletar_produto(
    produto_id: int,
    db: Session = Depends(get_db),
    admin: models.Admin = Depends(get_current_admin),
):
    produto = (
        db.query(models.Produto)
        .filter(models.Produto.id == produto_id)
        .first()
    )
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    try:
        db.delete(produto)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Não é possível excluir um produto que já foi usado em pedidos.",
        )

    return Response(status_code=204)


@router.get("/pedidos", response_model=List[schemas.PedidoOut])
def listar_pedidos(
    status_filter: Optional[Literal["RECEBIDO", "EM_PREPARO", "PRONTO", "ENTREGUE"]] = None,
    db: Session = Depends(get_db),
    admin: models.Admin = Depends(get_current_admin),
):
    query = db.query(models.Pedido).options(
        joinedload(models.Pedido.itens).joinedload(models.ItemPedido.produto)
    )
    if status_filter:
        query = query.filter(models.Pedido.status == models.StatusPedidoEnum(status_filter))
    pedidos = query.order_by(models.Pedido.data.desc()).all()

    result = []
    for pedido in pedidos:
        itens_out = [
            schemas.ItemPedidoOut(
                produto_id=ip.produto_id,
                nome_produto=ip.produto.nome,
                quantidade=ip.quantidade,
                subtotal=float(ip.subtotal),
                preco_unitario=float(ip.produto.preco)
            )
            for ip in pedido.itens
        ]
        result.append(
            schemas.PedidoOut(
                id=pedido.id,
                cliente=pedido.cliente,
                mesa=pedido.mesa,
                total=float(pedido.total),
                status=pedido.status.value,
                data=pedido.data,
                itens=itens_out,
            )
        )
    return result


@router.post("/categorias", response_model=schemas.CategoriaOut, status_code=201)
def criar_categoria(
    cat_in: schemas.CategoriaCreate,
    db: Session = Depends(get_db),
    admin: models.Admin = Depends(get_current_admin),
):
    existente = (
        db.query(models.Categoria)
        .filter(models.Categoria.nome == cat_in.nome)
        .first()
    )
    if existente:
        raise HTTPException(
            status_code=400,
            detail="Já existe uma categoria com esse nome.",
        )

    categoria = models.Categoria(nome=cat_in.nome)
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria


class PedidoStatusUpdate(schemas.BaseModel):
    status: Literal["RECEBIDO", "EM_PREPARO", "PRONTO", "ENTREGUE"]

@router.patch("/pedidos/{pedido_id}/status", response_model=schemas.PedidoOut)
def atualizar_status_pedido(
    pedido_id: int,
    body: PedidoStatusUpdate,
    db: Session = Depends(get_db),
    admin: models.Admin = Depends(get_current_admin),
):
    pedido = db.query(models.Pedido).filter(models.Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    pedido.status = models.StatusPedidoEnum(body.status)
    db.commit()
    db.refresh(pedido)

    itens_out = [
        schemas.ItemPedidoOut(
            produto_id=ip.produto_id,
            nome_produto=ip.produto.nome,
            quantidade=ip.quantidade,
            subtotal=float(ip.subtotal),
            preco_unitario=float(ip.produto.preco)
        )
        for ip in pedido.itens
    ]

    return schemas.PedidoOut(
        id=pedido.id,
        cliente=pedido.cliente,
        mesa=pedido.mesa,
        total=float(pedido.total),
        status=pedido.status.value,
        data=pedido.data,
        itens=itens_out,
    )
