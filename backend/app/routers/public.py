# app/routers/public.py
from decimal import Decimal
import base64
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from ..database import SessionLocal
from .. import models
from .. import schemas

router = APIRouter(tags=["cliente"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/categorias", response_model=List[schemas.CategoriaComProdutos])
def listar_categorias_com_produtos(db: Session = Depends(get_db)):
    categorias = (
        db.query(models.Categoria)
        .options(joinedload(models.Categoria.produtos))
        .all()
    )

    result = []
    for cat in categorias:
        produtos_out = []
        for p in cat.produtos:
            img_b64 = (
                base64.b64encode(p.imagem).decode("utf-8") if p.imagem else None
            )
            produtos_out.append(
                schemas.ProdutoOut(
                    id=p.id,
                    nome=p.nome,
                    descricao=p.descricao,
                    preco=float(p.preco),
                    categoria_id=p.categoria_id,
                    imagem_base64=img_b64,
                )
            )

        result.append(
            schemas.CategoriaComProdutos(
                id=cat.id,
                nome=cat.nome,
                produtos=produtos_out,
            )
        )

    return result

@router.get("/produtos/{produto_id}", response_model=schemas.ProdutoOut)
def obter_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = (
        db.query(models.Produto)
        .filter(models.Produto.id == produto_id)
        .first()
    )
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    img_b64 = (
        base64.b64encode(produto.imagem).decode("utf-8")
        if produto.imagem
        else None
    )

    return schemas.ProdutoOut(
        id=produto.id,
        nome=produto.nome,
        descricao=produto.descricao,
        preco=float(produto.preco),
        categoria_id=produto.categoria_id,
        imagem_base64=img_b64,
    )

@router.post("/pedidos", response_model=schemas.PedidoOut, status_code=201)
def criar_pedido(pedido_in: schemas.PedidoCreate, db: Session = Depends(get_db)):
    if not pedido_in.itens:
        raise HTTPException(status_code=400, detail="Pedido sem itens")

    total = Decimal("0.00")
    itens_db = []

    for item in pedido_in.itens:
        produto = db.query(models.Produto).filter(models.Produto.id == item.produto_id).first()
        if not produto:
            raise HTTPException(status_code=400, detail=f"Produto {item.produto_id} inválido")

        subtotal = Decimal(produto.preco) * item.quantidade
        total += subtotal
        itens_db.append((produto, item.quantidade, subtotal))

    pedido = models.Pedido(
        cliente=pedido_in.cliente,
        mesa=pedido_in.mesa,
        total=total,
        status=models.StatusPedidoEnum.RECEBIDO,
    )
    db.add(pedido)
    db.flush()  

    for produto, qtd, subtotal in itens_db:
        ip = models.ItemPedido(
            pedido_id=pedido.id,
            produto_id=produto.id,
            quantidade=qtd,
            subtotal=subtotal,
        )
        db.add(ip)

    db.commit()
    db.refresh(pedido)

    itens_out = [
        schemas.ItemPedidoOut(
            produto_id=ip.produto_id,
            nome_produto=ip.produto.nome,
            quantidade=ip.quantidade,
            subtotal=float(ip.subtotal),
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

@router.get("/pedidos/{pedido_id}", response_model=schemas.PedidoOut)
def obter_pedido(pedido_id: int, db: Session = Depends(get_db)):
    pedido = (
        db.query(models.Pedido)
        .options(joinedload(models.Pedido.itens).joinedload(models.ItemPedido.produto))
        .filter(models.Pedido.id == pedido_id)
        .first()
    )
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    itens_out = [
        schemas.ItemPedidoOut(
            produto_id=ip.produto_id,
            nome_produto=ip.produto.nome,
            quantidade=ip.quantidade,
            subtotal=float(ip.subtotal),
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
