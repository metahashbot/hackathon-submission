<<<<<<< HEAD
import { companyLogos } from "../constants";
=======
import { companyLogos } from "../constants/index.js";
>>>>>>> b65e2d9f90adeb6abb94f4b2feac94b03cee3080

const CompanyLogos = ({ className }) => {
  return (
    <div className={className}>
      <h5 className="tagline mb-6 text-center text-n-1/50">
        You will use Digital contract anywhere in coming future
      </h5>
      <ul className="flex">
        {/*companyLogos.map((logo, index) => (
          <li
            className="flex items-center justify-center flex-1 h-[8.5rem]"
            key={index}
          >
            <img src={logo} width={134} height={28} alt={logo} />
          </li>
        ))*/}
      </ul>
    </div>
  );
};

export default CompanyLogos;
