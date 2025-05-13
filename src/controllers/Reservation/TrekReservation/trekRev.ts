import TrekReservation from "../../../models/Reservations/TrekReservation/TrekRevModel";
import { Request, Response } from "express";
import { sendEmail } from "../../../utils/setEmail";
import { customAlphabet } from "nanoid";
// import User from "../../../models/User/userModel";
import Business from "../../../models/Business/business";
import Trekking from "../../../models/Product/trekking";
import TrekRevLog from "../../../models/LogModel/TrekRevLog";

export const trekRev = async (req: Request, res: Response) => {
  const id = req.params.id;
  const customId = customAlphabet("1234567890", 4);
  let bookingId = customId();
  bookingId = "TrR" + bookingId;

  const {
    bookingName,
    numberOfPeople,
    email,
    phone,
    date,
    bookedBy,
    totalPrice,
  } = req.body;
  try {
    const trekData = await Trekking.findOne({ trekId: id });
    if (!trekData) {
      return res.status(401).json({ error: "Trek Unavailable" });
    }

    const businessdata = await Business.findOne({
      businessId: trekData.businessId,
    });
    // const userData = await User.findOne({ userId: bookedBy });
    // if (!userData) {
    //   return res.status(401).json({ error: "User Not found" });
    // }
    // const businessdata = await Business.findOne({ bId: vehData.businessId });

    let trekRev = new TrekReservation({
      bookedBy,
      bookingName,
      numberOfPeople,
      totalPrice,
      email,
      phone,
      date,
      businessId: trekData.businessId,
      bookingId,
      trekName: trekData.name,
      businessName: businessdata?.businessName,
      trekId: id,
    });
    trekRev = await trekRev.save();
    if (!trekRev) {
      return res.status(400).json({ error: "Booking failed" });
    }

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: email,
      subject: "Booking Confirmation",
      html: `  <div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.5;">
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
          <strong>Trek Name:</strong> ${trekData.name}
        </td>
     
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Passenger Name:</strong> ${bookingName}
        </td>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Number of Passengers:</strong> ${numberOfPeople}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Date:</strong> ${date}
        </td>
      </tr>
        <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> ${totalPrice}
        </td>
      </tr>
    </table>
  </div>

`,
    });
    // sendEmail({
    //   from: "beta.toursewa@gmail.com",
    //   to: businessdata?.primaryEmail,
    //   subject: "New Booking",
    //   html: `<h2>A new booking with booking Id ${bookingId} of vehicle ${id}</h2>`,
    // });
    return res.status(200).json({ message: "Successfully Booked" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTrekRev = async (req: Request, res: Response) => {
  try {
    const data = await TrekReservation.find();
    if (data.length > 0) {
      return res.send(data);
    } else {
      return res.json({ message: "No Trek Reservations " });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTrekRevByUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await TrekReservation.find({ bookedBy: id });
    if (data.length > 0) {
      return res.send(data);
    } else {
      return res.json({ message: "No Bookings Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
export const getTrekRevByBid = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await TrekReservation.find({ businessId: id });
    if (data.length === 0) {
      return res.json({ message: "No Bookings Found" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateTrekRevStatusByClient = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  const { status, bookingId, email } = req.body;
  try {
    const data = await TrekReservation.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Failed to Update" });
    }

    // const revDate = await ReservedDate.findOneAndDelete({
    //   bookingId: bookingId,
    // });
    // if (!revDate) {
    //   return res.status(400).json({ error: "failed to Update" });
    // }

    let Logs = new TrekRevLog({
      updatedBy: email,
      status: status,
      bookingId: bookingId,
      time: new Date(),
    });
    Logs = await Logs.save();
    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: email,
      subject: "Booking Status",
      html: `<div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.5;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 100px;">
    </div>
    <h1 style="font-size: 18px; font-weight: bold; text-align: left;">Booking Status</h1>
    <p style="font-size: 14px; text-align: left;">Your booking status on Toursewa is given below.</p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Status:</strong> <span style="color: #DC2626;">${status}</span>
        </td>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>BookingID:</strong> ${bookingId}
        </td>
      </tr>
    </table>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Trek Name:</strong> ${data.trekName}
        </td>
     
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Passenger Name:</strong> ${data.bookingName}
        </td>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Number of Passengers:</strong> ${data.numberOfPeople}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Date:</strong> ${data.date}
        </td>
      </tr>
        <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Date:</strong> ${data.totalPrice}
        </td>
      </tr>
    </table>
  </div>
`,
    });
    return res.status(200).json({ message: status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateTrekRevStatusByBid = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status, bookingId, email, updatedBy } = req.body;
  try {
    const data = await TrekReservation.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Failed to Update" });
    }

    let Logs = new TrekRevLog({
      updatedBy: updatedBy,
      status: status,
      bookingId: bookingId,
      time: new Date(),
    });
    Logs = await Logs.save();

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: email,
      subject: "Booking Status",
      html: `<div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.5;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 100px;">
    </div>
    <h1 style="font-size: 18px; font-weight: bold; text-align: left;">Booking Status</h1>
    <p style="font-size: 14px; text-align: left;">Your booking status on Toursewa is given below.</p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Status:</strong> <span style="color: #DC2626;">${status}</span>
        </td>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>BookingID:</strong> ${bookingId}
        </td>
      </tr>
    </table>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Trek Name:</strong> ${data.trekName}
        </td>
     
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Passenger Name:</strong> ${data.bookingName}
        </td>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Number of Passengers:</strong> ${data.numberOfPeople}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Date:</strong> ${data.date}
        </td>
      </tr>
    </table>
  </div>
 `,
    });
    return res.status(200).json({ message: status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
