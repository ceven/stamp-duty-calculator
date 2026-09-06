import { Component } from "react";
import "./App.css";
import StampDuty from "./StampDuty";
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

        <p className="App App-body">
          <h2>NSW</h2>
          <HomeStampDuty />
          <MotorVehicleStampDuty />
        </p>
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
      url: "https://www.revenue.nsw.gov.au/info/factsheet/duties/general/rates",
      image: house,
    };
    this.calculateDuty = this.calculateDuty.bind(this);
  }

  calculateDuty(value: number): number {
    if (this.wrongValue()) {
      return 0;
    }
    if (value <= 14000) {
      return (value * 1.25) / 100;
    }
    if (value <= 30000) {
      return 175 + (1.5 * (value - 14000)) / 100;
    }
    if (value <= 80000) {
      return 415 + (1.75 * (value - 30000)) / 100;
    }
    if (value <= 300000) {
      return 1290 + (3.5 * (value - 80000)) / 100;
    }
    if (value <= 1000000) {
      return 8990 + (4.5 * (value - 300000)) / 100;
    }
    return 40490 + (5.5 * (value - 1000000)) / 100;
  }
}

class MotorVehicleStampDuty extends StampDuty {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      duty: 0,
      value: 0,
      dutiable: "vehicle",
      url: "https://www.revenue.nsw.gov.au/taxes/vehicle",
      image: car,
    };
    this.calculateDuty = this.calculateDuty.bind(this);
  }

  calculateDuty(value: number): number {
    if (this.wrongValue()) {
      return 0;
    }
    if (value < 50000) {
      return (3 * value) / 100;
    }
    return 1350 + (5 * value) / 100;
  }
}

export default App;