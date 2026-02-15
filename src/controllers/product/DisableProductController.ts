import { Request, Response } from "express";
import { DisableProductService } from "../../services/product/DisableProductService";

class DisableProductController {
  async handle(req: Request, res: Response) {
    const id = req.query?.product_id as string;

    const disableProductService = new DisableProductService();
    const result = await disableProductService.execute({ id });

    res.json(result);
  }
}

export { DisableProductController };
