export type PedidoItem = {
  id_categoria_detectada: string;
  nombre_producto: string;
  variaciones: {
    currency: string;
    item_id: string;
    name: string;
    price: number;
  };
  cantidad: number;
  img_url?: string;
  descripcion?: string | null;
  hasVariations?: boolean;
};

export type Pedido = {
  [key: string]: PedidoItem;
};

export type MenuData = {
  [category: string]: PedidoItem[];
};