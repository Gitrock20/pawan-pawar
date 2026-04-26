import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Saanjh Backend is running" });
  });

  // Mock Products API
  app.get("/api/products", (req, res) => {
    res.json([
      {
        id: "1",
        name: "Midnight Jasmine",
        price: 1850,
        category: "Candle",
        description: "Hand-poured soy candle with jasmine and sandalwood notes.",
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        reviews: 24,
        notes: ["Jasmine", "Sandalwood", "Amber"]
      },
      {
        id: "2",
        name: "Golden Horizon Heart Necklace",
        price: 499,
        category: "Jewelry",
        description: "A minimalist open-heart pendant suspended on a sleek, fluid snake chain. Perfect for everyday elegance.",
        image: "/input_file_1.png",
        rating: 4.8,
        reviews: 12,
        material: "High-Quality Polished Brass"
      },
      {
        id: "3",
        name: "Cerulean Drift",
        price: 1450,
        category: "Candle",
        description: "Cool sea salt and cedarwood encapsulated in frosted glass.",
        image: "https://images.unsplash.com/photo-1596433532230-51a122e6db2a?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        reviews: 42,
        notes: ["Sea Salt", "Cedar", "Sage"]
      },
      {
        id: "4",
        name: "Golden Orbit Layered Hoops",
        price: 499,
        category: "Jewelry",
        description: "Effortlessly chic triple-layered hoop earrings that give you a bold, stacked look without the weight.",
        image: "/input_file_2.png",
        rating: 4.9,
        reviews: 8,
        material: "Brass with Gold Finish"
      },
      {
        id: "5",
        name: "Earth-Bound Amber",
        price: 1950,
        category: "Candle",
        description: "Deep, resinous amber paired with charred oak.",
        image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=800",
        rating: 4.6,
        reviews: 31,
        notes: ["Amber", "Charred Oak", "Tobacco"]
      },
      {
        id: "6",
        name: "Saanjh Blossom Cuff Bracelet",
        price: 499,
        category: "Jewelry",
        description: "A stunning open-cuff bracelet featuring intricately detailed, reflective floral motifs.",
        image: "/input_file_3.png",
        rating: 4.7,
        reviews: 5,
        material: "Handcrafted Polished Brass"
      },
      {
        id: "7",
        name: "Celestial Starlight Bangle",
        price: 499,
        category: "Jewelry",
        description: "A classic, smooth gold-finish bangle embedded with delicate, evenly spaced crystal accents.",
        image: "/input_file_4.png",
        rating: 4.8,
        reviews: 10,
        material: "Gold Finish with Crystals"
      },
      {
        id: "8",
        name: "Sunset Radiance Layered Chain",
        price: 499,
        category: "Jewelry",
        description: "A pre-layered necklace set featuring a bold herringbone chain paired with a delicate accent chain.",
        image: "/input_file_5.png",
        rating: 4.9,
        reviews: 14,
        material: "Layered Brass Chain"
      },
      {
        id: "9",
        name: "Midnight & Dawn Clover Bracelet",
        price: 499,
        category: "Jewelry",
        description: "A delicate chain bracelet featuring elegant four-leaf clover motifs. Available in onyx black or pearl white.",
        image: "/input_file_6.png",
        rating: 4.8,
        reviews: 20,
        material: "Polished Enamel and Brass"
      },
      {
        id: "10",
        name: "Twilight Guardian Evil Eye Bangle",
        price: 499,
        category: "Jewelry",
        description: "A beautifully twisted cable bangle adorned with protective evil eye charms and sparkling spacers.",
        image: "/input_file_7.png",
        rating: 5.0,
        reviews: 6,
        material: "Twisted Cable with Enamel Details"
      },
      {
        id: "11",
        name: "Moonlit Pearl Wavy Cuff",
        price: 499,
        category: "Jewelry",
        description: "A uniquely artistic, fluid wavy open cuff accented with beautifully placed luminous pearls.",
        image: "/input_file_8.png",
        rating: 4.7,
        reviews: 9,
        material: "Brass with Faux Pearls"
      },
      {
        id: "12",
        name: "Eternity Sparkle Bangle",
        price: 499,
        category: "Jewelry",
        description: "A sleek, flat-edge bangle featuring interspersed crystal detailing. Designed perfectly for stacking.",
        image: "/input_file_9.png",
        rating: 4.9,
        reviews: 11,
        material: "Polished Brass with Crystals"
      },
      {
        id: "13",
        name: "Luminous Pearl Heart Pendant",
        price: 499,
        category: "Jewelry",
        description: "A sweet and elegant V-shaped heart pendant filled with a shimmering mother-of-pearl inlay.",
        image: "/input_file_10.png",
        rating: 4.8,
        reviews: 15,
        material: "Mother of Pearl Inlay"
      }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Saanjh Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
