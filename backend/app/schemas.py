# app/schemas.py
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

# ---------- CATEGORIA / PRODUTO ----------

class ProdutoBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    preco: float

class ProdutoCreate(ProdutoBase):
    categoria_id: int
    imagem_base64: Optional[str] = None

class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    preco: Optional[float] = None
    categoria_id: Optional[int] = None
    imagem_base64: Optional[str] = None  

class ProdutoOut(ProdutoBase):
    id: int
    categoria_id: int
    imagem_base64: Optional[str] = None

    class Config:
        orm_mode = True

class CategoriaBase(BaseModel):
    nome: str

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaOut(BaseModel):
    id: int
    nome: str

    class Config:
        orm_mode = True

class CategoriaComProdutos(CategoriaOut):
    produtos: List[ProdutoOut]

# ---------- PEDIDO / ITENS ----------

class ItemPedidoCreate(BaseModel):
    produto_id: int
    quantidade: int

class PedidoCreate(BaseModel):
    cliente: str
    mesa: int
    itens: List[ItemPedidoCreate]

class ItemPedidoOut(BaseModel):
    produto_id: int
    nome_produto: str
    quantidade: int
    subtotal: float

class PedidoOut(BaseModel):
    id: int
    cliente: str
    mesa: int
    total: float
    status: str
    data: datetime
    itens: List[ItemPedidoOut]

    class Config:
        orm_mode = True

# ---------- AUTENTICAÇÃO ADMIN ----------

class Token(BaseModel):
    access_token: str
    token_type: str

class AdminLogin(BaseModel):
    username: str
    password: str


class CategoriaBase(BaseModel):
    nome: str

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaOut(CategoriaBase):
    id: int
    
