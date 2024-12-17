
import { useMediaQuery } from "react-responsive";

const Footer = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 400px)" });

  return (
    <footer className="bg-green-950 py-[70px] text-center p-4">
      {isMobile ? (
        <div className="mobile">
       
          <div className="copyright">
            <p className="font-bold uppercase tracking-wide text-sm text-white">
              Made by 
              <span className="bg-white text-black px-1">&nbsp; Rajan Dhariyaparmar&nbsp;</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="pc">
          <a href="https://github.com/rajand2510" className="github mx-2 text-3xl text-white transition-colors duration-500">
            <ion-icon name="logo-github"></ion-icon>
          </a>
         
          <div className="copyright">
            <p className="font-bold uppercase tracking-wide text-white">
              Made by
              <a href="https://www.linkedin.com/in/rajan-dhariyaparmar-7bb7a2233/" target="_blank" rel="noopener noreferrer">
                <span className="bg-white text-black px-1 hover:bg-white hover:text-black transition-colors duration-1500">&nbsp;Rajan Dhariyaparmar&nbsp;</span>
              </a>
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;