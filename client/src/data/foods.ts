export interface FoodItem {
  id: number;
  cat: string;
  name: string;
  kcal: number;
  pro: number;
  cho: number;
  fat: number;
  fib: number;
}

export const FOOD_DB: FoodItem[] = [
  { id: 1, cat: "Cereali", name: "Pasta semola (cruda)", kcal: 351, pro: 13.4, cho: 68.1, fat: 1.8, fib: 2.7 },
  { id: 2, cat: "Cereali", name: "Pasta semola (cotta)", kcal: 131, pro: 4.9, cho: 25.6, fat: 0.7, fib: 1.0 },
  { id: 3, cat: "Cereali", name: "Riso bianco (crudo)", kcal: 339, pro: 6.7, cho: 77.4, fat: 0.4, fib: 0.2 },
  { id: 4, cat: "Cereali", name: "Riso basmati (cotto)", kcal: 138, pro: 2.8, cho: 31.0, fat: 0.1, fib: 0.2 },
  { id: 5, cat: "Cereali", name: "Fiocchi d'avena", kcal: 372, pro: 13.0, cho: 60.9, fat: 7.1, fib: 10.0 },
  { id: 6, cat: "Cereali", name: "Pane comune", kcal: 275, pro: 8.1, cho: 56.8, fat: 0.5, fib: 3.8 },
  { id: 7, cat: "Cereali", name: "Pane integrale", kcal: 243, pro: 8.5, cho: 45.5, fat: 1.6, fib: 6.5 },
  { id: 8, cat: "Cereali", name: "Quinoa (cotta)", kcal: 120, pro: 4.4, cho: 21.3, fat: 1.9, fib: 2.8 },
  { id: 9, cat: "Carni", name: "Pollo petto (crudo)", kcal: 110, pro: 23.3, cho: 0, fat: 1.7, fib: 0 },
  { id: 10, cat: "Carni", name: "Pollo petto (cotto)", kcal: 165, pro: 31.0, cho: 0, fat: 3.6, fib: 0 },
  { id: 11, cat: "Carni", name: "Tacchino petto", kcal: 107, pro: 24.1, cho: 0, fat: 1.0, fib: 0 },
  { id: 12, cat: "Carni", name: "Manzo macinato magro", kcal: 155, pro: 17.1, cho: 0, fat: 9.6, fib: 0 },
  { id: 13, cat: "Carni", name: "Manzo fesa", kcal: 133, pro: 22.0, cho: 0, fat: 5.0, fib: 0 },
  { id: 14, cat: "Carni", name: "Maiale lonza", kcal: 107, pro: 20.7, cho: 0, fat: 2.8, fib: 0 },
  { id: 15, cat: "Pesce", name: "Salmone atlantico", kcal: 177, pro: 19.9, cho: 0, fat: 10.4, fib: 0 },
  { id: 16, cat: "Pesce", name: "Tonno al naturale", kcal: 103, pro: 22.5, cho: 0, fat: 1.2, fib: 0 },
  { id: 17, cat: "Pesce", name: "Merluzzo", kcal: 72, pro: 16.6, cho: 0, fat: 0.5, fib: 0 },
  { id: 18, cat: "Pesce", name: "Sgombro", kcal: 205, pro: 18.6, cho: 0, fat: 13.9, fib: 0 },
  { id: 19, cat: "Pesce", name: "Branzino", kcal: 97, pro: 18.4, cho: 0, fat: 2.0, fib: 0 },
  { id: 20, cat: "Pesce", name: "Gamberetti cotti", kcal: 99, pro: 20.9, cho: 0, fat: 1.7, fib: 0 },
  { id: 21, cat: "Uova", name: "Uovo intero", kcal: 143, pro: 12.9, cho: 0.5, fat: 9.9, fib: 0 },
  { id: 22, cat: "Uova", name: "Albume", kcal: 43, pro: 10.9, cho: 0.7, fat: 0, fib: 0 },
  { id: 23, cat: "Uova", name: "Tuorlo", kcal: 322, pro: 15.9, cho: 0.3, fat: 28.8, fib: 0 },
  { id: 24, cat: "Latticini", name: "Latte intero", kcal: 64, pro: 3.3, cho: 4.7, fat: 3.5, fib: 0 },
  { id: 25, cat: "Latticini", name: "Latte scremato", kcal: 34, pro: 3.5, cho: 5.0, fat: 0.1, fib: 0 },
  { id: 26, cat: "Latticini", name: "Yogurt greco 0%", kcal: 57, pro: 10.2, cho: 3.6, fat: 0.4, fib: 0 },
  { id: 27, cat: "Latticini", name: "Yogurt greco intero", kcal: 97, pro: 9.0, cho: 3.6, fat: 5.0, fib: 0 },
  { id: 28, cat: "Latticini", name: "Ricotta vaccina", kcal: 146, pro: 11.0, cho: 3.0, fat: 10.1, fib: 0 },
  { id: 29, cat: "Latticini", name: "Fiocchi di latte", kcal: 95, pro: 12.4, cho: 2.7, fat: 3.7, fib: 0 },
  { id: 30, cat: "Latticini", name: "Mozzarella", kcal: 253, pro: 18.7, cho: 0, fat: 19.5, fib: 0 },
  { id: 31, cat: "Latticini", name: "Parmigiano Reggiano", kcal: 392, pro: 36.0, cho: 0, fat: 28.0, fib: 0 },
  { id: 32, cat: "Legumi", name: "Ceci cotti", kcal: 120, pro: 6.3, cho: 18.2, fat: 2.1, fib: 5.4 },
  { id: 33, cat: "Legumi", name: "Lenticchie cotte", kcal: 116, pro: 8.0, cho: 19.3, fat: 0.4, fib: 3.7 },
  { id: 34, cat: "Legumi", name: "Fagioli borlotti cotti", kcal: 112, pro: 7.4, cho: 16.9, fat: 0.5, fib: 7.8 },
  { id: 35, cat: "Verdure", name: "Broccoli", kcal: 27, pro: 3.1, cho: 2.4, fat: 0.4, fib: 2.9 },
  { id: 36, cat: "Verdure", name: "Spinaci", kcal: 17, pro: 3.0, cho: 0.4, fat: 0.3, fib: 2.2 },
  { id: 37, cat: "Verdure", name: "Zucchine", kcal: 11, pro: 1.0, cho: 0.9, fat: 0.2, fib: 1.0 },
  { id: 38, cat: "Verdure", name: "Pomodori", kcal: 18, pro: 0.9, cho: 3.5, fat: 0.2, fib: 1.0 },
  { id: 39, cat: "Verdure", name: "Carote", kcal: 35, pro: 1.1, cho: 7.7, fat: 0.2, fib: 3.1 },
  { id: 40, cat: "Verdure", name: "Asparagi", kcal: 25, pro: 2.2, cho: 3.0, fat: 0.2, fib: 2.1 },
  { id: 41, cat: "Verdure", name: "Funghi champignon", kcal: 22, pro: 3.5, cho: 0.3, fat: 0.2, fib: 1.5 },
  { id: 42, cat: "Frutta", name: "Mela", kcal: 52, pro: 0.3, cho: 13.8, fat: 0.2, fib: 2.4 },
  { id: 43, cat: "Frutta", name: "Banana", kcal: 89, pro: 1.1, cho: 22.8, fat: 0.3, fib: 2.6 },
  { id: 44, cat: "Frutta", name: "Arancia", kcal: 36, pro: 0.8, cho: 8.1, fat: 0.2, fib: 1.6 },
  { id: 45, cat: "Frutta", name: "Fragole", kcal: 27, pro: 0.9, cho: 5.3, fat: 0.4, fib: 1.6 },
  { id: 46, cat: "Frutta", name: "Kiwi", kcal: 61, pro: 1.1, cho: 14.7, fat: 0.5, fib: 3.0 },
  { id: 47, cat: "Frutta", name: "Mirtilli", kcal: 57, pro: 0.7, cho: 14.5, fat: 0.3, fib: 2.4 },
  { id: 48, cat: "Frutta", name: "Avocado", kcal: 160, pro: 2.0, cho: 8.5, fat: 14.7, fib: 6.7 },
  { id: 49, cat: "Grassi", name: "Olio EVO", kcal: 884, pro: 0, cho: 0, fat: 99.9, fib: 0 },
  { id: 50, cat: "Grassi", name: "Burro", kcal: 717, pro: 0.9, cho: 0.1, fat: 81.1, fib: 0 },
  { id: 51, cat: "Frutta Secca", name: "Mandorle", kcal: 597, pro: 21.3, cho: 4.3, fat: 54.3, fib: 10.9 },
  { id: 52, cat: "Frutta Secca", name: "Noci", kcal: 689, pro: 14.1, cho: 13.7, fat: 65.2, fib: 6.7 },
  { id: 53, cat: "Frutta Secca", name: "Arachidi", kcal: 589, pro: 27.0, cho: 16.1, fat: 49.2, fib: 8.1 },
  { id: 54, cat: "Supplementi", name: "Whey Protein (polvere)", kcal: 385, pro: 74.0, cho: 10.0, fat: 6.5, fib: 0 },
  { id: 55, cat: "Supplementi", name: "Casein Protein (polvere)", kcal: 360, pro: 76.0, cho: 5.0, fat: 4.5, fib: 0 },
];
