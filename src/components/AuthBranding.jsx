import Logo from "../assets/images/Logo.svg";
import Illustration from "../assets/images/GuidyLoginIllustrationCutout.png";

export default function AuthBranding() {
  return (
      <div className="guidy-login-art">
        <img className="guidy-login-logo" src={Logo} alt="Guidy" />
        <img
          className="guidy-login-illustration"
          src={Illustration}
          width="1536"
          height="1024"
          alt=""
        />
        <p className="guidy-auth-caption">
          Your academic plans, all in one place.
        </p>
      </div>
  );
}
