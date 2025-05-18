import { Request, Response } from "express";
import VehicleReservation from "../../../models/Reservations/VehicleReservation/vehReserv";
import Vehicle from "../../../models/Product/vehicle";
import ReservedDate from "../../../models/Reservations/VehicleReservation/ReservedDated";
import { customAlphabet } from "nanoid";
import { sendEmail } from "../../../utils/setEmail";
import Business from "../../../models/Business/business";
import VehRevLogs from "../../../models/LogModel/VehRevLogs";

export const vehReservation = async (req: Request, res: Response) => {
  const id = req.params.id;
  const customId = customAlphabet("1234567890", 4);
  let bookingId = customId();
  bookingId = "R" + bookingId;

  const {
    bookingName,
    email,
    phone,
    totalPrice,
    pickUpLocation,
    dropOffLocation,
    pickUpDate,
    dropOffDate,
    address,
    bookedBy,
    numberOfPassengers,
  } = req.body;

  let bookingDate: string[] = [];

  const newPickUpDate = pickUpDate;
  const newDropOffDate = dropOffDate;

  let current = new Date(newPickUpDate);

  while (current <= new Date(newDropOffDate)) {
    bookingDate.push(current.toDateString());
    current.setDate(current.getDate() + 1);
  }
  try {
    const vehData = await Vehicle.findOne({ vehicleId: id });
    if (!vehData) {
      return res.status(401).json({ error: "Vehicle Unavailable" });
    }
    const businessdata = await Business.findOne({
      businessId: vehData.businessId,
    });

    let vehRev = new VehicleReservation({
      vehicleId: id,
      vehicleType: vehData.vehCategory,
      vehicleNumber: vehData.vehNumber,
      vehicleName: vehData.name,
      bookingId: bookingId,
      businessId: vehData.businessId,
      businessName: vehData.businessName,
      businessPhone: businessdata?.primaryPhone,
      vehicleImage: vehData.vehImages?.length ? vehData.vehImages : [],
      bookedBy,
      totalPrice,
      pickUpLocation,
      dropOffLocation,
      email,
      phone,
      pickUpDate,
      dropOffDate,
      address,
      bookingName,
      numberOfPassengers,
    });
    vehRev = await vehRev.save();
    if (!vehRev) {
      return res.status(400).json({ error: "Booking failed" });
    } else {
      let resrvDate = new ReservedDate({
        vehicleId: id,
        bookingDate,
        bookedBy,
        bookingId: bookingId,
        time: new Date(),
      });
      resrvDate = await resrvDate.save();
      if (!resrvDate) {
        return res.status(400).json({ error: "failed to save date" });
      } else {
        sendEmail({
          from: "beta.toursewa@gmail.com",
          to: email,
          subject: "Booking Confirmation",
          html: `
           <div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.5;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 100px;">
    </div>
    <h1 style="font-size: 18px; font-weight: bold; text-align: left;">Booking Status</h1>
    <p style="font-size: 14px; text-align: left;">Your booking status on Toursewa is given below.</p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Status:</strong> <span style="color: #DC2626;">Pending</span>
        </td>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>BookingID:</strong> ${bookingId}
        </td>
      </tr>
    </table>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Vehicle:</strong> ${vehData.name}
        </td>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Vehicle Number:</strong> ${vehData.vehNumber}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Passenger Name:</strong> ${bookingName}
        </td>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Number of Passengers:</strong> ${numberOfPassengers}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>From - To:</strong> ${pickUpLocation} - ${dropOffLocation}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${totalPrice}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Start Date - End Date:</strong> ${pickUpDate} - ${dropOffDate}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>For Enquiry:</strong> ${businessdata?.primaryPhone}
        </td>
      </tr>
    </table>
  </div>`,
        });
        sendEmail({
          from: "beta.toursewa@gmail.com",
          to: businessdata?.primaryEmail,
          subject: "New Booking",
          html: `<h2>A new booking with booking Id ${bookingId} of vehicle ${id}</h2>`,
        });
        return res.status(200).json({ message: "Booked" });
      }
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getRevByClientId = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await VehicleReservation.find({ bookedBy: id });
    if (data.length > 0) {
      return res.send(data);
    } else {
      return res.status(400).json({ error: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateReservationStatusByClient = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  const { status, bookingId, email } = req.body;
  try {
    const data = await VehicleReservation.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Failed to Update" });
    }

    const revDate = await ReservedDate.findOneAndDelete({
      bookingId: bookingId,
    });
    if (!revDate) {
      return res.status(400).json({ error: "failed to Update" });
    }

    let vehLogs = new VehRevLogs({
      updatedBy: email,
      status: status,
      bookingId: bookingId,
      time: new Date(),
    });
    vehLogs = await vehLogs.save();
    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: email,
      subject: "Booking Status",
      html: ` <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
      </div>
      <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
      <p style="font-size: 14px; text-align: center;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr>
          <td style="font-size: 14px; font-weight: bold;">Status:</td>
          <td style="font-size: 14px; color: #DC2626;">${status}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">BookingID:</td>
          <td style="font-size: 14px;">${bookingId}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">Vehicle:</td>
          <td style="font-size: 14px; color: #64748B;">${data.vehicleName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">Vehicle Number:</td>
          <td style="font-size: 14px; color: #64748B;">${data.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">Passenger Name:</td>
          <td style="font-size: 14px; color: #64748B;">${data.bookingName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">Number of Passengers:</td>
          <td style="font-size: 14px; color: #64748B;">${data.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">From - To:</td>
          <td style="font-size: 14px; color: #64748B;">${data.pickUpLocation} - ${data.dropOffLocation}</td>
        </tr>
          <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${data.totalPrice}
        </td>
      </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold;">Start Date - End Date:</td>
          <td style="font-size: 14px; color: #64748B;">${data.pickUpDate} - ${data.dropOffDate}</td>
        </tr>
      </table>
    </div>`,
    });
    return res.status(200).json({ message: status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateReservationStatusByBid = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  const { status, bookingId, email, updatedBy } = req.body;
  try {
    const data = await VehicleReservation.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Failed to Update" });
    }

    let vehLogs = new VehRevLogs({
      updatedBy: updatedBy,
      status: status,
      bookingId: bookingId,
      time: new Date(),
    });
    vehLogs = await vehLogs.save();

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: email,
      subject: "Booking Status",
      html: ` <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
      </div>
      <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
      <p style="font-size: 14px; text-align: center; margin-bottom: 20px;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Status:</td>
          <td style="font-size: 14px; color: #DC2626; padding: 8px 0;">${status}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">BookingID:</td>
          <td style="font-size: 14px; padding: 8px 0;">${bookingId}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${data.vehicleName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle Number:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${data.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Passenger Name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${data.bookingName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Number of Passengers:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${data.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">From - To:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${data.pickUpLocation} - ${data.dropOffLocation}</td>
        </tr>
          <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${data.totalPrice}
        </td>
      </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Start Date - End Date:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${data.pickUpDate} - ${data.dropOffDate}</td>
        </tr>
      </table>
    </div>`,
    });
    return res.status(200).json({ message: status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// export const updateReservationByBid = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const { status, email, updatedBy } = req.body;
//   try {
//     const data = await VehicleReservation.findOneAndUpdate(
//       { bookingId: id },
//       { status: status },
//       { new: true }
//     );
//     if (!data) {
//       return res.status(400).json({ error: "Failed to update" });
//     } else {
//       const revDate = await ReservedDate.findOneAndDelete({
//         bookingId: id,
//       });
//       if (!revDate) {
//         return res.status(400).json({ error: "Failed" });
//       }
//       let vehLogs = new VehRevLogs({
//         updatedBy: updatedBy,
//         status: status,
//         bookingId: id,
//         time: new Date(),
//       });
//       vehLogs = await vehLogs.save();
//       sendEmail({
//         from: "beta.toursewa@gmail.com",
//         to: email,
//         subject: "Booking Status",
//         html: `<div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;">
//   <div style="text-align: center; margin-bottom: 20px;">
//     <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
//   </div>
//   <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
//   <p style="font-size: 14px; text-align: center; margin-bottom: 20px;">Your booking status on toursewa is given below.</p>
//   <table style="width: 100%; border-collapse: collapse; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
//     <tr style="background-color: #F3F4F6;">
//       <td style="font-size: 14px; font-weight: bold; padding: 12px 8px; text-align: left; width: 40%;">Status:</td>
//       <td style="font-size: 14px; color: #DC2626; padding: 12px 8px; text-align: left; width: 60%;">${status}</td>
//     </tr>
//     <tr>
//       <td style="font-size: 14px; font-weight: bold; padding: 12px 8px; text-align: left;">BookingID:</td>
//       <td style="font-size: 14px; padding: 12px 8px; text-align: left;">${id}</td>
//     </tr>
//     <tr style="background-color: #F3F4F6;">
//       <td style="font-size: 14px; font-weight: bold; padding: 12px 8px; text-align: left;">Vehicle:</td>
//       <td style="font-size: 14px; color: #64748B; padding: 12px 8px; text-align: left;">${data.vehicleName}</td>
//     </tr>
//     <tr>
//       <td style="font-size: 14px; font-weight: bold; padding: 12px 8px; text-align: left;">Vehicle Number:</td>
//       <td style="font-size: 14px; color: #64748B; padding: 12px 8px; text-align: left;">${data.vehicleNumber}</td>
//     </tr>
//     <tr style="background-color: #F3F4F6;">
//       <td style="font-size: 14px; font-weight: bold; padding: 12px 8px; text-align: left;">Passenger Name:</td>
//       <td style="font-size: 14px; color: #64748B; padding: 12px 8px; text-align: left;">${data.bookingName}</td>
//     </tr>
//     <tr>
//       <td style="font-size: 14px; font-weight: bold; padding: 12px 8px; text-align: left;">Number of Passengers:</td>
//       <td style="font-size: 14px; color: #64748B; padding: 12px 8px; text-align: left;">${data.numberOfPassengers}</td>
//     </tr>
//     <tr style="background-color: #F3F4F6;">
//       <td style="font-size: 14px; font-weight: bold; padding: 12px 8px; text-align: left;">From - To:</td>
//       <td style="font-size: 14px; color: #64748B; padding: 12px 8px; text-align: left;">${data.pickUpLocation} - ${data.dropOffLocation}</td>
//     </tr>
//       <tr>
//         <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
//           <strong>Price:</strong> NRP.${data.totalPrice}
//         </td>
//       </tr>
//     <tr>
//       <td style="font-size: 14px; font-weight: bold; padding: 12px 8px; text-align: left;">Start Date - End Date:</td>
//       <td style="font-size: 14px; color: #64748B; padding: 12px 8px; text-align: left;">${data.pickUpDate} - ${data.dropOffDate}</td>
//     </tr>
//   </table>
// </div>
// `,
//       });
//       return res.status(200).json({ message: status });
//     }
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };

export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const data = await VehicleReservation.find();
    if (data.length > 0) {
      return res.send(data);
    } else {
      return res.status(400).json({ error: "No Vehicle Revservatrions " });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getRevByBusinessId = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await VehicleReservation.find({ businessId: id });
    if (data.length === 0) {
      return res.status(404).json({ error: "No Data found" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getRevByVehicleId = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await VehicleReservation.find({ vehicleId: id });
    if (data.length === 0) {
      return res.status(404).json({ error: "No Reservations found" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
