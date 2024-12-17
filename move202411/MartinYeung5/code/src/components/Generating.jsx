<<<<<<< HEAD
import { loading } from "../assets";
=======
import { loading } from "../assets/index.js";
>>>>>>> b65e2d9f90adeb6abb94f4b2feac94b03cee3080

const Generating = ({ className }) => {
  return (
    <div
      className={`flex items-center h-[3.5rem] px-6 bg-n-8/80 rounded-[1.7rem] ${
        className || ""
      } text-base`}
    >
      <img className="w-5 h-5 mr-4" src={loading} alt="Loading" />
      Octopus Verify is protecting your digital contract
    </div>
  );
};

export default Generating;
