export type Product = {
  id: string;
  name: string;
  notes: string;
  meta: string;
  price: number;
  img?: string;
};

export const products: Product[] = [
  {
    id: 'ethiopia',
    name: 'Эфиопия Иргачеффе',
    notes: 'цветочный, бергамот',
    meta: 'светлая обжарка · 250 г',
    price: 32,
    img: '/img/ethiopia.jpg',
  },
  {
    id: 'colombia',
    name: 'Колумбия Уила',
    notes: 'карамель, красное яблоко',
    meta: '250 г',
    price: 29,
    img: '/img/colombia.jpg',
  },
  {
    id: 'brazil',
    name: 'Бразилия Серрадо',
    notes: 'орех, шоколад',
    meta: 'под эспрессо · 250 г',
    price: 26,
    img: '/img/brazil.jpg',
  },
  {
    id: 'drip',
    name: 'Дрип-пакеты, ассорти',
    notes: '10 штук',
    meta: 'для офиса и дороги',
    price: 18,
  },
];

export const SUBSCRIPTION_PRICE = 54;
export const FREE_DELIVERY_FROM = 50;
