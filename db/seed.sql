-- Demo data for Cefolum

CREATE DATABASE IF NOT EXISTS cefolum CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cefolum;

INSERT INTO categories (id, name, slug) VALUES
  (1, 'Salon', 'salon'),
  (2, 'Chambre', 'chambre'),
  (3, 'Cuisine', 'cuisine'),
  (4, 'Bureau', 'bureau')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (id, category_id, title, slug, description, price, sale_price, rating, image_url, created_at) VALUES
  (1, 1, 'Panorama Chromatique', 'panorama-chromatique', 'Tableau panoramique multicolore ideal pour illuminer un salon moderne.', 520.00, 470.00, 4.90, '/images/products/salon/salon-01.png', '2024-08-12 09:00:00'),
  (2, 1, 'Reflets Urbains', 'reflets-urbains', 'Oeuvre inspiree des reflets citadins, parfaite au-dessus d''un canape panoramique.', 480.00, NULL, 4.70, '/images/products/salon/salon-05.jpg', '2024-07-05 12:00:00'),
  (3, 1, 'Eclosion Coloree', 'eclosion-coloree', 'Triptyque floral abstrait pour creer un point focal vibrant dans votre piece de vie.', 395.00, 355.00, 4.60, '/images/products/salon/salon-09.jpg', '2024-05-22 10:15:00'),
  (13, 1, 'Lumiere Vibrante', 'lumiere-vibrante', 'Panorama abstrait aux nuances chaudes pour un salon lumineux.', 415.00, 379.00, 4.60, '/images/products/salon/salon-02.jpg', '2024-04-02 09:00:00'),
  (14, 1, 'Cascade Pastel', 'cascade-pastel', 'Composition verticale douce pour une ambiance cosy dans le salon.', 360.00, NULL, 4.40, '/images/products/salon/salon-03.jpg', '2024-03-08 10:30:00'),
  (15, 1, 'Graphismes Retro', 'graphismes-retro', 'Jeu graphique inspire des annees 70 pour dynamiser un mur de salon.', 335.00, NULL, 4.20, '/images/products/salon/salon-07.webp', '2024-01-26 14:10:00'),
  (4, 2, 'Brume Celeste', 'brume-celeste', 'Toile apaisante aux degrades bleus pour instaurer un climat relaxant dans la chambre.', 340.00, 299.00, 4.80, '/images/products/chambre/chambre-01.png', '2024-04-18 08:45:00'),
  (5, 2, 'Serenite Vegetale', 'serenite-vegetale', 'Composition vegetale minimaliste qui diffuse une atmosphere zen.', 310.00, NULL, 4.50, '/images/products/chambre/chambre-07.jpg', '2024-03-12 11:10:00'),
  (6, 2, 'Matin Brumeux', 'matin-brumeux', 'Paysage pastel et brume legere pour accompagner vos reveils en douceur.', 285.00, 249.00, 4.40, '/images/products/chambre/chambre-09.jpg', '2024-02-03 09:30:00'),
  (16, 2, 'Horizons Calmes', 'horizons-calmes', 'Paysage brumeux bleu glacier pour une chambre paisible.', 295.00, 259.00, 4.60, '/images/products/chambre/chambre-02.png', '2024-05-04 07:45:00'),
  (17, 2, 'Monts Pastels', 'monts-pastels', 'Reliefs minimalistes et touches terracotta pour une chambre boheme.', 305.00, NULL, 4.50, '/images/products/chambre/chambre-03.jpeg', '2024-04-01 12:30:00'),
  (18, 2, 'Nuit Florale', 'nuit-florale', 'Composition florale nuit bleu marine pour une chambre elegante.', 320.00, 288.00, 4.70, '/images/products/chambre/chambre-05.webp', '2024-02-18 19:20:00'),
  (7, 3, 'Cafe Signature', 'cafe-signature', 'Illustration barista chic pour habiller un coin breakfast ou coffee shop a domicile.', 210.00, 189.00, 4.60, '/images/products/cuisine/cuisine-01.jpg', '2024-07-01 07:50:00'),
  (8, 3, 'Douceurs Provencales', 'douceurs-provencales', 'Nature morte de fruits gorges de soleil pour une cuisine vitaminee.', 230.00, NULL, 4.30, '/images/products/cuisine/cuisine-05.jpg', '2024-06-14 10:05:00'),
  (9, 3, 'Atelier Gourmet', 'atelier-gourmet', 'Affiche d''ustensiles elegants pour une cuisine de chef creative.', 245.00, 219.00, 4.50, '/images/products/cuisine/cuisine-08.jpg', '2024-04-29 08:40:00'),
  (19, 3, 'Saveurs Ensoleillees', 'saveurs-ensoleillees', 'Trio d''agrumes stylises pour une cuisine pleine de vitamines.', 225.00, 199.00, 4.40, '/images/products/cuisine/cuisine-02.webp', '2024-05-28 08:00:00'),
  (20, 3, 'Coffee Break', 'coffee-break', 'Affiche coffee time au style vintage pour accompagner vos pauses.', 205.00, NULL, 4.20, '/images/products/cuisine/cuisine-03.webp', '2024-03-22 09:55:00'),
  (21, 3, 'Epices Suspendues', 'epices-suspendues', 'Palette ocre et bleu avec bocaux d''epices pour une cuisine creative.', 235.00, 209.00, 4.50, '/images/products/cuisine/cuisine-04.webp', '2024-01-17 13:05:00'),
  (10, 4, 'Modules Geometriques', 'modules-geometriques', 'Serie geometrique minimaliste pour structurer un espace de travail moderne.', 310.00, NULL, 4.40, '/images/products/bureau/bureau-01.jpg', '2024-05-09 09:20:00'),
  (11, 4, 'Focus Quotidien', 'focus-quotidien', 'Affiche typographique noire et or pour booster l''energie de votre bureau.', 280.00, 249.00, 4.50, '/images/products/bureau/bureau-03.jpg', '2024-03-30 07:30:00'),
  (12, 4, 'Energie Creative', 'energie-creative', 'Illustration abstraite riche en couleurs pour stimuler la creativite.', 295.00, NULL, 4.60, '/images/products/bureau/bureau-05.jpg', '2024-02-18 16:00:00'),
  (22, 4, 'Geometrie Zen', 'geometrie-zen', 'Formes minimalistes sable et noir pour un bureau raffine.', 290.00, 260.00, 4.50, '/images/products/bureau/bureau-02.jpeg', '2024-06-10 11:40:00'),
  (23, 4, 'Plan de Strategie', 'plan-de-strategie', 'Mindmap noir et blanc avec notes dorees pour garder le cap.', 275.00, NULL, 4.30, '/images/products/bureau/bureau-04.jpg', '2024-04-25 10:00:00'),
  (24, 4, 'Dynamiques Chromatiques', 'dynamiques-chromatiques', 'Fresque abstraite multicolore pour stimuler les idees au bureau.', 305.00, 279.00, 4.60, '/images/products/bureau/bureau-06.jpeg', '2024-02-01 15:30:00')
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO users (id, email, password_hash, role) VALUES
  (1, 'admin@cefolum.test', PASSWORD('Admin!123'), 'admin'),
  (2, 'membre@cefolum.test', PASSWORD('Cefolum#24'), 'user')
ON DUPLICATE KEY UPDATE role = VALUES(role);

INSERT INTO orders (id, user_id, total, status, created_at) VALUES
  (1, 2, 780.00, 'paid', '2024-08-20 16:45:00'),
  (2, 2, 498.00, 'pending', '2024-09-05 09:30:00')
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 1, 470.00),
  (2, 1, 10, 1, 310.00),
  (3, 2, 5, 1, 310.00),
  (4, 2, 7, 1, 188.00)
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);

