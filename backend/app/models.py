# app/models.py
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    Column, Integer, String, Numeric, DateTime,
    ForeignKey, Enum, LargeBinary
)
from sqlalchemy.orm import relationship

from .database import Base

class StatusPedidoEnum(PyEnum):
    RECEBIDO = "RECEBIDO"
    EM_PREPARO = "EM_PREPARO"
    PRONTO = "PRONTO"
    ENTREGUE = "ENTREGUE"

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    icone = Column(LargeBinary, nullable=True)

    produtos = relationship("Produto", back_populates="categoria")

class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    descricao = Column(String, nullable=True)
    preco = Column(Numeric(10, 2), nullable=False)
    imagem = Column(LargeBinary, nullable=True)

    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)
    categoria = relationship("Categoria", back_populates="produtos")

    item_pedidos = relationship("ItemPedido", back_populates="produto")

class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    cliente = Column(String, nullable=False)
    mesa = Column(Integer, nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(StatusPedidoEnum), default=StatusPedidoEnum.RECEBIDO, nullable=False)
    data = Column(DateTime, default=datetime.utcnow)

    itens = relationship("ItemPedido", back_populates="pedido")

class ItemPedido(Base):
    __tablename__ = "itens_pedido"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)
    quantidade = Column(Integer, default=1, nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)

    pedido = relationship("Pedido", back_populates="itens")
    produto = relationship("Produto", back_populates="item_pedidos")

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
