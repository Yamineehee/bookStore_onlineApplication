import bookModel from "../models/bookM.js";
import { Op } from "sequelize";

class bookC {
  async addBook(req, res, imageName) {
    try {
      const data = await bookModel.create({ ...req.body, image: imageName });
      data ? res.json(data) : res.json({ success: false, message: "Error during adding the book." });
    } catch (err) {
      res.json({ success: false, message: "Error while querying in database" });
    }
  }

  async getBookByID(req, res) {
    const { id } = req.params;
    if (id) {
      const data = await bookModel.findByPk(id);
      data ? res.json(data) : res.json([]);
    } else {
      res.json({ success: false, message: "Book ID is not provided." });
    }
  }

  async updateBook(req, res) {
    const { id } = req.params;
    if (id) {
      const [updated] = await bookModel.update(req.body, { where: { id } });
      updated ? res.json({ success: true, message: "Updated book" }) : res.json({ success: false, message: "Couldn't update book" });
    } else {
      res.json({ success: false, message: "Book ID is not provided." });
    }
  }

  async deleteBook(req, res) {
    const { id } = req.params;
    if (id) {
      const deleted = await bookModel.destroy({ where: { id } });
      deleted ? res.json({ success: true, message: "Book deleted" }) : res.json({ success: false, message: "Couldn't delete book" });
    } else {
      res.json({ success: false, message: "Book ID is not provided." });
    }
  }

  async searchBook(req, res) {
    const { q } = req.query;
    if (q) {
      const data = await bookModel.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { author: { [Op.like]: `%${q}%` } }
          ]
        },
        raw: true
      });

      data.forEach(d => {
        d.image = `http://localhost:8000/uploads/${d.image}`;
      });

      res.json(data);
    } else {
      res.json({ success: false, message: "Empty query search string." });
    }
  }

  async getBooks(req, res) {
    const { limit = 20 } = req.query;
    try {
      const data = await bookModel.findAll({
        limit: parseInt(limit),
        raw: true
      });
  
      data.forEach(d => {
        d.image = `http://localhost:8000/uploads/${d.image}`;
      });
  
      res.json(data);
    } catch (err) {
      console.error("Error fetching books:", err); // Log the detailed error
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new bookC();
