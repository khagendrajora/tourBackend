import { Request, Response } from "express";
import BusinessCategory from "../models/Category/businessCategory";
import SubCategory from "../models/subCategory";
import TrekCategory from "../models/Category/trekCategory";
import TourCategory from "../models/Category/tourCategory"
import VehileCategory from '../models/Category/vehicleCategory'
const { customAlphabet } = require("nanoid");

export const addBusinessCategory = async (req: Request, res: Response) => {
  let { categoryName, desc, subCategory } = req.body;
  categoryName = categoryName.toLowerCase().trim();
  const customId = customAlphabet("1234567890", 4);
  let categoryId = customId();
  categoryId = "BC" + categoryId;
  try {
    let category = new BusinessCategory({
      categoryName,
      desc,
      subCategory,
      categoryId: categoryId,
    });

    BusinessCategory.findOne({ categoryName }).then(async (data) => {
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

export const getBusinessCategory = async (req: Request, res: Response) => {
  try {
    let category = await BusinessCategory.find();
    if (category.length > 0) {
      return res.send(category);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const getBusinessCategoryDetails = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let categoryDetails = await BusinessCategory.findOne({ categoryId: id });
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

export const updateBusinessCategory = async (req: Request, res: Response) => {
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
    const category = await BusinessCategory.findOneAndUpdate(
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

export const deleteBusinessCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    BusinessCategory.findByIdAndDelete(id).then((data) => {
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
    const data = await BusinessCategory.findOneAndUpdate(
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

export const addTrekCategory = async (req: Request, res: Response) => {
  let { categoryName, desc, subCategory } = req.body;
  categoryName = categoryName.toLowerCase().trim();
  const customId = customAlphabet("1234567890", 4);
  let categoryId = customId();
  categoryId = "TrC" + categoryId;
  try {
    let category = new TrekCategory({
      categoryName,
      desc,
      subCategory,
      categoryId: categoryId,
    });

    TrekCategory.findOne({ categoryName }).then(async (data) => {
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

export const getTrekCategory = async (req: Request, res: Response) => {
  try {
    let category = await TrekCategory.find();
    if (category.length > 0) {
      return res.send(category);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const getTrekCategoryDetails = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  try {
    let categoryDetails = await TrekCategory.findOne({ categoryId: id });
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

export const updateTrekCategory = async (req: Request, res: Response) => {
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
    const category = await TrekCategory.findOneAndUpdate(
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

export const addTrekSubCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { subCategory } = req.body;

  if (!Array.isArray(subCategory)) {
    return res.status(400).json({ error: "Data must be an array format" });
  }

  try {
    const newSubCategory = subCategory.map((item) => item.toLowerCase().trim());
    const data = await TrekCategory.findOneAndUpdate(
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

export const deleteTrekCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    TrekCategory.findByIdAndDelete(id).then((data) => {
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


export const addTourCategory = async (req: Request, res: Response) => {
  let { categoryName, desc, subCategory } = req.body;
  categoryName = categoryName.toLowerCase().trim();
  const customId = customAlphabet("1234567890", 4);
  let categoryId = customId();
  categoryId = "TuC" + categoryId;
  try {
    let category = new TourCategory({
      categoryName,
      desc,
      subCategory,
      categoryId: categoryId,
    });

    TourCategory.findOne({ categoryName }).then(async (data) => {
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

export const getTourCategory = async (req: Request, res: Response) => {
  try {
    let category = await TourCategory.find();
    if (category.length > 0) {
      return res.send(category);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const getTourCategoryDetails = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  try {
    let categoryDetails = await TourCategory.findOne({ categoryId: id });
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

export const updateTourCategory = async (req: Request, res: Response) => {
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
    const category = await TourCategory.findOneAndUpdate(
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

export const addTourSubCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { subCategory } = req.body;

  if (!Array.isArray(subCategory)) {
    return res.status(400).json({ error: "Data must be an array format" });
  }

  try {
    const newSubCategory = subCategory.map((item) => item.toLowerCase().trim());
    const data = await TourCategory.findOneAndUpdate(
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

export const deleteTourCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    TourCategory.findByIdAndDelete(id).then((data) => {
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



export const addVehicleCategory = async (req: Request, res: Response) => {
  let { categoryName, desc, subCategory } = req.body;
  categoryName = categoryName.toLowerCase().trim();
  const customId = customAlphabet("1234567890", 4);
  let categoryId = customId();
  categoryId = "VC" + categoryId;
  try {
    let category = new VehileCategory({
      categoryName,
      desc,
      subCategory,
      categoryId: categoryId,
    });

    VehileCategory.findOne({ categoryName }).then(async (data) => {
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

export const getVehicleCategory = async (req: Request, res: Response) => {
  try {
    let category = await VehileCategory.find();
    if (category.length > 0) {
      return res.send(category);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const getVehicleCategoryDetails = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  try {
    let categoryDetails = await VehileCategory.findOne({ categoryId: id });
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

export const updateVehicleCategory = async (req: Request, res: Response) => {
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
    const category = await VehileCategory.findOneAndUpdate(
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

export const addVehicleSubCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { subCategory } = req.body;

  if (!Array.isArray(subCategory)) {
    return res.status(400).json({ error: "Data must be an array format" });
  }

  try {
    const newSubCategory = subCategory.map((item) => item.toLowerCase().trim());
    const data = await VehileCategory.findOneAndUpdate(
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

export const deleteVehicleCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    VehileCategory.findByIdAndDelete(id).then((data) => {
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