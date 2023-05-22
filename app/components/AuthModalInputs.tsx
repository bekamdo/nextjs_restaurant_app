import React from "react";
interface Props {
  inputs: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    password: string;
  };
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSignIn: boolean;
}

const AuthModalInputs = ({ inputs, handleChangeInput, isSignIn }: Props) => {
  return (
    <div>
      {isSignIn ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%] outline-none"
            placeholder="First Name"
            value={inputs.firstName}
            onChange={handleChangeInput}
            name="firstName"
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%] outline-none"
            placeholder="Last Name"
            value={inputs.lastName}
            onChange={handleChangeInput}
            name="lastName"
          />
        </div>
      )}

      {isSignIn ? null : (
        <div className="my-3 flex justify-between text-sm ">
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%] outline-none"
            placeholder="Phone"
            value={inputs.phone}
            onChange={handleChangeInput}
            name="phone"
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%] outline-none"
            placeholder="City"
            value={inputs.city}
            onChange={handleChangeInput}
            name="city"
          />
        </div>
      )}

      <div className="my-3 flex justify-between text-sm">
        <input
          type="email"
          className="border rounded p-2 py-3 w-full outline-none"
          placeholder="Email"
          value={inputs.email}
          onChange={handleChangeInput}
          name="email"
        />
      </div>

      <div className="my-3 flex justify-between text-sm">
        <input
          type="password"
          className="border rounded p-2 py-3 w-full outline-none"
          placeholder="Password"
          value={inputs.password}
          onChange={handleChangeInput}
          name="password"
        />
      </div>
    </div>
  );
};

export default AuthModalInputs;
