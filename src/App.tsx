import { Component } from "react";
import "./App.css";
import StampDuty, { DutyTable } from "./StampDuty";
import {
  calculateHomeDuty,
  calculateHomeDutyWithFhbas,
  calculateMotorVehicleDuty,
} from "./duty";
import house from "./assets/house.png";
import car from "./assets/car.png";
import stamp from "./assets/stamp.png";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={stamp} className="App-logo" alt="logo" />
          <h1 className="App-title">Stamp Duty Calculator</h1>
          <img src={stamp} className="App-logo" alt="logo" />
        </header>

        <div className="App App-body">
          <h2>NSW</h2>
          <HomeStampDuty />
          <MotorVehicleStampDuty />
        </div>
        <footer className="App-footer">
          <div className="footer-text">
            <p>Made by Caroline Even. Check my other websites on</p>
            <a
              href="https://ceven.github.io/"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Caroline's Github Pages
            </a>
          </div>
          <br />
          <div>
            Icons made by{" "}
            <a href="http://www.freepik.com" title="Freepik">
              Freepik
            </a>{" "}
            from{" "}
            <a
              href="https://www.flaticon.com/"
              title="Flaticon"
            >
              www.flaticon.com
            </a>{" "}
            is licensed by{" "}
            <a
              href="http://creativecommons.org/licenses/by/3.0/"
              title="Creative Commons BY 3.0"
              target="_blank"
              rel="noreferrer"
            >
              CC 3.0 BY
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

class HomeStampDuty extends StampDuty {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      duty: 0,
      value: 0,
      dutiable: "home",
      year: 2026,
      url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty/understanding-transfer-duty/calculate-transfer-duty",
      image: house,
    };
    this.calculateDuty = this.calculateDuty.bind(this);
  }

  hasAssistance(): boolean {
    return true;
  }

  assistanceLabel(): string {
    return "Apply First Home Buyers Assistance Scheme (FHBAS)";
  }

  dutyTable(): DutyTable {
    return {
      caption: `${this.state.year} Property Transfer Duty Rates`,
      rows: [
        { range: "$0 – $18,000", duty: "$1.25 per $100 (minimum $20)" },
        { range: "$18,001 – $38,000", duty: "$225 + $1.50 per $100 over $18,000" },
        { range: "$38,001 – $103,000", duty: "$525 + $1.75 per $100 over $38,000" },
        { range: "$103,001 – $387,000", duty: "$1,662 + $3.50 per $100 over $103,000" },
        { range: "$387,001 – $1,290,000", duty: "$11,602 + $4.50 per $100 over $387,000" },
        { range: "Over $1,290,000", duty: "$52,237 + $5.50 per $100 over $1,290,000" },
        { range: "Over $3,870,000", duty: "$194,137 + $7.00 per $100 over $3,870,000" },
      ],
    };
  }

  calculateDuty(value: number, assistance: boolean): number {
    if (this.wrongValue()) {
      return 0;
    }
    return assistance
      ? calculateHomeDutyWithFhbas(value)
      : calculateHomeDuty(value);
  }
}

class MotorVehicleStampDuty extends StampDuty {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      duty: 0,
      value: 0,
      dutiable: "vehicle",
      year: 2026,
      url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/motor-vehicle-duty",
      image: car,
    };
    this.calculateDuty = this.calculateDuty.bind(this);
  }

  dutyTable(): DutyTable {
    return {
      caption: `${this.state.year} Motor Vehicle Duty Rates`,
      rows: [
        { range: "$0 – $44,999", duty: "$3.00 per $100" },
        { range: "$45,000 or more", duty: "$1,350 + $5.00 per $100 over $45,000" },
      ],
    };
  }

  calculateDuty(value: number): number {
    if (this.wrongValue()) {
      return 0;
    }
    return calculateMotorVehicleDuty(value);
  }
}

export default App;