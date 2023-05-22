"use client";
import useReservation from "@/hooks/useReservation";
import { CircularProgress } from "@mui/material";
import React, { FC, useEffect, useState } from "react";

interface FormProps {
  slug: string;
  date: string;
  partySize: string;
}
const Form: FC<FormProps> = ({ slug, date, partySize }) => {
  const [day, time] = date.split("T");
  const [disabled, setDisabled] = useState(true);
  const [inputs, setInputs] = useState({
    bookerFirstName: "",
    bookerLastName: "",
    bookerPhone: "",
    bookerEmail: "",
    bookerOccasion: "",
    bookerRequest: "",
  });
  const [didBook, setDidBook] = useState(false);
  const { loading, error, createReservation } = useReservation();

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async () => {
    const booking = await createReservation({
      slug,
      partySize,
      time,
      day,
      bookerFirstName: inputs.bookerFirstName,
      bookerLastName: inputs.bookerLastName,
      bookerEmail: inputs.bookerEmail,
      bookerOccasion: inputs.bookerOccasion,
      bookerPhone: inputs.bookerPhone,
      bookerRequest: inputs.bookerRequest,
      setDidBook,
    });
  };

  useEffect(() => {
    if (
      inputs.bookerFirstName &&
      inputs.bookerLastName &&
      inputs.bookerPhone &&
      inputs.bookerEmail
    ) {
      return setDisabled(false);
    }
    return setDisabled(true);
  }, [inputs]);
  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
      {didBook ? (
        <div>
          <h1>You are all Booked Up</h1>
          <p>Enjoy Reservation</p>
        </div>
      ) : (
        <>
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="First Name"
            name="bookerFirstName"
            onChange={handleChangeInput}
            value={inputs.bookerFirstName}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Last Name"
            name="bookerLastName"
            onChange={handleChangeInput}
            value={inputs.bookerLastName}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Phone number"
            name="bookerPhone"
            onChange={handleChangeInput}
            value={inputs.bookerPhone}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Email"
            name="bookerEmail"
            onChange={handleChangeInput}
            value={inputs.bookerEmail}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Occasion (Optional)"
            name="bookerOccasion"
            onChange={handleChangeInput}
            value={inputs.bookerOccasion}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Requests (Optional)"
            name="bookerRequest"
            onChange={handleChangeInput}
            value={inputs.bookerRequest}
          />
          <button
            disabled={disabled || loading}
            className="bg-red-600 w-full p-3  text-white font-bold rounded disabled:bg-gray-300"
            onClick={handleClick}
          >
            {loading ? (
              <CircularProgress color="inherit" />
            ) : (
              " Complete Reservation"
            )}
          </button>
          <p className="mt-4 text-sm">
            By clicking “Complete reservation” you agree to the OpenTable Terms
            of Use and Privacy Policy. Standard text message rates may apply.
            You may opt out of receiving text messages at any time.
          </p>
        </>
      )}
    </div>
  );
};

export default Form;
