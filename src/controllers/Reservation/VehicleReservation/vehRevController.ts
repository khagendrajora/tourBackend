import { Request, Response } from "express";
import VehicleReservation from "../../../models/Reservations/VehicleReservation/vehReserv";
import Vehicle from "../../../models/Product/vehicle";
import ReservedDate from "../../../models/Reservations/VehicleReservation/ReservedDated";
import { customAlphabet } from "nanoid";
import { sendEmail } from "../../../utils/setEmail";
import Business from "../../../models/Business/business";
import VehRevLogs from "../../../models/LogModel/VehRevLogs";
import Driver from "../../../models/Business/Driver";

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

export const assignDriver = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { bookingId, updatedBy } = req.body;

  try {
    const driver = await Driver.findOne({ driverId: id });
    if (!driver) {
      return res.status(401).json({ error: "Driver Not Found" });
    }
    const booking = await VehicleReservation.findOne({ bookingId });
    if (!booking) {
      return res.status(401).json({ error: "Reservation Not Found" });
    }
    const revDates = await ReservedDate.findOne({ bookingId });
    if (!revDates) {
      return res.status(401).json({ error: "Reservation Dates Not Found" });
    }

    const updateBooking = await VehicleReservation.findOneAndUpdate(
      { bookingId: bookingId },
      {
        driver: driver.name,
        driverPhone: driver.phone,
        driverId: driver.driverId,
      },
      { new: true }
    );
    if (!updateBooking) {
      return res.status(401).json({ error: "Failed To Assign" });
    }

    const updateDriver = await Driver.findOneAndUpdate(
      { driverId: id },
      {
        $addToSet: {
          operationalDate: { $each: revDates.bookingDate },
          bookingId: { $each: [booking._id] },
        },
      },
      { new: true }
    );
    if (!updateDriver) {
      return res.status(401).json({ error: "Failed To update Driver" });
    }

    let vehLogs = new VehRevLogs({
      updatedBy: updatedBy,
      status: `Assigned to the reservation ${bookingId}`,
      bookingId: bookingId,
      time: new Date(),
    });
    vehLogs = await vehLogs.save();

    if (!vehLogs) {
      return res.status(400).json({ error: "Failed to save the logs" });
    }

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: booking.email,
      subject: "Assigned Driver For Your Booking",
      html: ` <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
      </div>
      <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
      <p style="font-size: 14px; text-align: center; margin-bottom: 20px;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Status:</td>
          <td style="font-size: 14px; color: #DC2626; padding: 8px 0;">${booking.status}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">BookingID:</td>
          <td style="font-size: 14px; padding: 8px 0;">${bookingId}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.vehicleName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle Number:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Passenger Name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.bookingName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Number of Passengers:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">From - To:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.pickUpLocation} - ${booking.dropOffLocation}</td>
        </tr>
          <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${booking.totalPrice}
        </td>
      </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Start Date - End Date:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.pickUpDate} - ${booking.dropOffDate}</td>
        </tr>
         <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${driver.name}</td>
        </tr>
           <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver Phone:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${driver.phone}</td>
        </tr>
         <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver Phone:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${driver.driverId}</td>
        </tr>
      </table>
    </div>`,
    });

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: driver.email,
      subject: "New Booking Alert",
      html: ` <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
      </div>
      <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
      <p style="font-size: 14px; text-align: center; margin-bottom: 20px;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Status:</td>
          <td style="font-size: 14px; color: #DC2626; padding: 8px 0;">${booking.status}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">BookingID:</td>
          <td style="font-size: 14px; padding: 8px 0;">${bookingId}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.vehicleName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle Number:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Passenger Name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.bookingName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Number of Passengers:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">From - To:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.pickUpLocation} - ${booking.dropOffLocation}</td>
        </tr>
          <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${booking.totalPrice}
        </td>
      </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Start Date - End Date:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${booking.pickUpDate} - ${booking.dropOffDate}</td>
        </tr>
         <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${driver.name}</td>
        </tr>
           <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver Phone:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${driver.phone}</td>
        </tr>
         <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver Phone:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${driver.driverId}</td>
        </tr>
      </table>
    </div>`,
    });

    return res.status(200).json({ message: "Driver Assigned" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const removeDriver = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { updatedBy } = req.body;
  try {
    const revData = await VehicleReservation.findOne({ bookingId: id });
    if (!revData) {
      return res.status(404).json({ error: "Not Found1" });
    }

    const revDates = await ReservedDate.findOne({ bookingId: id });
    if (!revDates) {
      return res.status(404).json({ error: "Not Found2" });
    }
    const driver = await Driver.findOne({ driverId: revData.driverId });
    if (!driver) {
      return res.status(404).json({ error: "Not Found3" });
    }
    const updateDriver = await Driver.findOneAndUpdate(
      { driverId: driver.driverId },
      {
        $pull: {
          bookingId: revData._id,
          operationalDate: { $in: revDates.bookingDate },
        },
      },
      { new: true }
    );
    if (!updateDriver) {
      return res.status(404).json({ error: "Failed" });
    }
    const updateReservation = await VehicleReservation.updateOne(
      { bookingId: id },
      {
        $unset: {
          driver: "",
          driverPhone: "",
        },
      }
    );
    if (!updateReservation) {
      return res.status(404).json({ error: "Failed" });
    }
    let vehLogs = new VehRevLogs({
      updatedBy: updatedBy,
      status: `Removed Driver`,
      bookingId: id,
      time: new Date(),
    });
    vehLogs = await vehLogs.save();

    if (!vehLogs) {
      return res.status(400).json({ error: "Failed to save the logs" });
    }

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: revData.email,
      subject: "Driver Remove alert",
      html: ` <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
      </div>
      <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
      <p style="font-size: 14px; text-align: center; margin-bottom: 20px;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Status:</td>
          <td style="font-size: 14px; color: #DC2626; padding: 8px 0;">${revData.status}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">BookingID:</td>
          <td style="font-size: 14px; padding: 8px 0;">${revData.bookingId}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.vehicleName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle Number:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Passenger Name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.bookingName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Number of Passengers:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">From - To:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.pickUpLocation} - ${revData.dropOffLocation}</td>
        </tr>
          <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${revData.totalPrice}
        </td>
      </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Start Date - End Date:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.pickUpDate} - ${revData.dropOffDate}</td>
        </tr>
         <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Driver Removed</td>
        </tr>
      </table>
    </div>`,
    });

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: driver.email,
      subject: "Alert Removed From the booking",
      html: ` <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://tourbackend-rdtk.onrender.com/public/uploads/logo.png" alt="Logo" style="max-width: 200px;" />
      </div>
      <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Booking Status</h1>
      <p style="font-size: 14px; text-align: center; margin-bottom: 20px;">Your booking status on toursewa is given below.</p>
      <table style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; background-color: #F9FAFB; padding: 20px;">
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Status:</td>
          <td style="font-size: 14px; color: #DC2626; padding: 8px 0;">${revData.status}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">BookingID:</td>
          <td style="font-size: 14px; padding: 8px 0;">${revData.bookingId}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.vehicleName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Vehicle Number:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Passenger Name:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.bookingName}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Number of Passengers:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">From - To:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.pickUpLocation} - ${revData.dropOffLocation}</td>
        </tr>
          <tr>
        <td style="font-size: 14px; padding: 10px; border: 1px solid #ddd;">
          <strong>Price:</strong> NRP.${revData.totalPrice}
        </td>
      </tr>
        <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">Start Date - End Date:</td>
          <td style="font-size: 14px; color: #64748B; padding: 8px 0;">${revData.pickUpDate} - ${revData.dropOffDate}</td>
        </tr>
         <tr>
          <td style="font-size: 14px; font-weight: bold; padding: 8px 0;">${driver.name} has been removed from the booking ${revData.bookingId}</td>
        
      
      </table>
    </div>`,
    });

    return res.status(200).json({
      message: "Driver removed from reservation",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
