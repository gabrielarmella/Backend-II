import ProductService from "../services/product.service.js";
import { deleteFile } from "../utils/fileSystem.js";
import paths from "../utils/paths.js";

export default class ProductController {
    #productService;

    constructor() {
        this.#productService = new ProductService();
    }


    async getAll(req, res) {
        try {
            const products = await this.#productService.findAll(req.query);
            res.sendSuccess200(products);
        } catch (error) {
            res.sendError(error);
        }
    }

    async getById(req, res) {
        try {
            const product = await this.#productService.findOneById(req.params.id);
            res.sendSuccess200(product);
        } catch (error) {
            res.sendError(error);
        }
    }


    async create(req, res) {
        try {
            const product = await this.#productService.insertOne(req.body, req.file?.filename);
            res.sendSuccess201(product);
        } catch (error) {
            if (req.file?.filename) await deleteFile(paths.images, req.file?.filename);
            res.sendError(error);
        }
    }

    async update(req, res) {
        try {
            const product = await this.#productService.updateOneById(req.params.id, req.body, req.file?.filename);
            res.sendSuccess200(product);
        } catch (error) {
            if (req.file?.filename) await deleteFile(paths.images, req.file?.filename);
            res.sendError(error);
        }
    }

    async delete(req, res) {
        try {
            const product = await this.#productService.deleteOneById(req.params.id);
            res.sendSuccess200(product);
        } catch (error) {
            res.sendError(error);
        }
    }
}