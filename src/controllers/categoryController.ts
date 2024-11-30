import { Request, Response } from "express";
import Category from "../models/Category/category";
import SubCategory from "../models/subCategory";
import ProductCategory from "../models/Category/productCategory";
const { customAlphabet } = require("nanoid");

export const addCategory = async (req: Request, res: Response) => {
  let { categoryName, desc, subCategory } = req.body;
  categoryName = categoryName.toLowerCase().trim();
  const customId = customAlphabet("1234567890", 4);
  let categoryId = customId();
  categoryId = "C" + categoryId;
  try {
    let category = new Category({
      categoryName,
      desc,
      subCategory,
      categoryId: categoryId,
    });

    Category.findOne({ categoryName }).then(async (data) => {
      if (data) {
        return res.status(400).json({ error: "Category already Exist" });
      } else {
        category = await category.save();
        if (!category) {
          return res.status(409).json({ error: "fail to add category" });
        } else {
          return res.send(category);
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    let category = await Category.find();
    if (category.length > 0) {
      return res.send(category);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const getCategoryDetails = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let categoryDetails = await Category.findOne({ categoryId: id });
    if (!categoryDetails) {
      return res
        .status(404)
        .json({ error: "Failed to fetch category Details" });
    } else {
      return res.send(categoryDetails);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { categoryName, desc, subCategory } = req.body;
  categoryName = categoryName.toLowerCase().trim();

  try {
    const updatedData: { [key: string]: any } = {
      categoryName,
      desc,
      subCategory,
    };

    if (subCategory !== undefined) {
      if (Array.isArray(subCategory) && subCategory.length === 0) {
        updatedData.subCategory = [];
      } else {
        updatedData.subCategory = subCategory;
      }
    } else {
      updatedData.subCategory = [];
    }
    const category = await Category.findOneAndUpdate(
      { categoryId: id },
      updatedData,
      { new: true }
    );
    if (!category) {
      return res.status(400).json({
        error: "Failed to Update",
      });
    } else {
      return res.status(200).json({ message: "Successfully Updated" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    Category.findByIdAndDelete(id).then((data) => {
      if (!data) {
        return res.status(404).json({ error: "Failed to delete" });
      } else {
        return res.status(200).json({ message: "Successfully Deleted" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const addSubCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { subCategory } = req.body;

  if (!Array.isArray(subCategory)) {
    return res.status(400).json({ error: "Data must be an array format" });
  }

  try {
    const newSubCategory = subCategory.map((item) => item.toLowerCase().trim());
    const data = await Category.findOneAndUpdate(
      { categoryId: id },
      { $push: { subCategory: { $each: newSubCategory } } },
      { new: true }
    );
    if (data) {
      return res.status(200).json({ message: "Sub Category Added" });
    } else {
      return res.status(404).json({ error: "Failed TO add" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

// export const getSubCategory = async (req: Request, res: Response) => {
//   const subCategory = await SubCategory.find().populate("categoryName");
//   if (!subCategory) {
//     return res.status(404).json({ error: "Failed to fetch Sub category" });
//   } else {
//     return res.send(subCategory);
//   }
// };

export const deleteSubCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    SubCategory.findByIdAndDelete(id).then((data) => {
      if (!data) {
        return res.status(404).json({ error: "Failed to delete" });
      } else {
        return res.status(200).json({ message: "Successfully Deleted" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

// export const subcategoryDetails = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   try {
//     await SubCategory.findById(id).then((data) => {
//       if (!data) {
//         return res.status(404).json({ error: "Detailed not found" });
//       } else {
//         return res.send(data);
//       }
//     });
//   } catch (error: any) {
//     return res.status(500).json({ error: error });
//   }
// };

// export const updateSubcategory = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   let { categoryName, subCategoryName, desc } = req.body;
//   categoryName = categoryName.toLowerCase().trim();
//   subCategoryName = subCategoryName.trim();
//   let categoryId;
//   try {
//     const data = await Category.findOne({ categoryName });
//     if (!data) {
//       return res
//         .status(400)
//         .json({ error: "Category not found,  add category First" });
//     } else {
//       categoryId = data._id;
//       const newdata = await SubCategory.findByIdAndUpdate(
//         id,
//         {
//           categoryName,
//           subCategoryName,
//           desc,
//           categoryId,
//         },
//         { new: true }
//       );
//       if (!newdata) {
//         return res.status(400).json({ error: "failed to update" });
//       } else {
//         return res.status(200).json({ message: "Successfully Updated" });
//       }
//     }
//   } catch (error: any) {
//     return res.status(500).json({ error: error });
//   }
// };

export const addProductCategory = async (req: Request, res: Response) => {
  let { categoryName, desc, subCategory } = req.body;
  categoryName = categoryName.toLowerCase().trim();
  const customId = customAlphabet("1234567890", 4);
  let categoryId = customId();
  categoryId = "PC" + categoryId;
  try {
    let category = new ProductCategory({
      categoryName,
      desc,
      subCategory,
      categoryId: categoryId,
    });

    ProductCategory.findOne({ categoryName }).then(async (data) => {
      if (data) {
        return res.status(400).json({ error: "Category already Exist" });
      } else {
        category = await category.save();
        if (!category) {
          return res.status(409).json({ error: "Failed T0 Add" });
        } else {
          return res.send(category);
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
};

export const getProductCategory = async (req: Request, res: Response) => {
  try {
    let category = await ProductCategory.find();
    if (category.length > 0) {
      return res.send(category);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const getProductCategoryDetails = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  try {
    let categoryDetails = await ProductCategory.findOne({ categoryId: id });
    if (!categoryDetails) {
      return res
        .status(404)
        .json({ error: "Failed to fetch category Details" });
    } else {
      return res.send(categoryDetails);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const updateProductCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { categoryName, desc, subCategory } = req.body;
  categoryName = categoryName.toLowerCase().trim();

  try {
    const updatedData: { [key: string]: any } = {
      categoryName,
      desc,
      subCategory,
    };

    if (subCategory !== undefined) {
      if (Array.isArray(subCategory) && subCategory.length === 0) {
        updatedData.subCategory = [];
      } else {
        updatedData.subCategory = subCategory;
      }
    } else {
      updatedData.subCategory = [];
    }
    const category = await ProductCategory.findOneAndUpdate(
      { categoryId: id },
      updatedData,
      { new: true }
    );
    if (!category) {
      return res.status(400).json({
        error: "Failed to Update",
      });
    } else {
      return res.status(200).json({ message: "Successfully Updated" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const addProductSubCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { subCategory } = req.body;

  if (!Array.isArray(subCategory)) {
    return res.status(400).json({ error: "Data must be an array format" });
  }

  try {
    const newSubCategory = subCategory.map((item) => item.toLowerCase().trim());
    const data = await ProductCategory.findOneAndUpdate(
      { categoryId: id },
      { $push: { subCategory: { $each: newSubCategory } } },
      { new: true }
    );
    if (data) {
      return res.status(200).json({ message: "Sub Category Added" });
    } else {
      return res.status(404).json({ error: "Failed TO add" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const deleteProductCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    ProductCategory.findByIdAndDelete(id).then((data) => {
      if (!data) {
        return res.status(404).json({ error: "Failed to delete" });
      } else {
        return res.status(200).json({ message: "Successfully Deleted" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};
