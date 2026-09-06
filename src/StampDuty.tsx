import { ChangeEvent, Component } from "react";
import "./StampDuty.css";

interface StampDutyState {
  value: number;
  duty: number;
  dutiable: string;
  url: string;
  image: string;
}

class StampDuty extends Component<Record<string, never>, StampDutyState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      value: 0,
      duty: 0,
      dutiable: "dutiable",
      url: "",
      image: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    this.setState({
      value,
      duty: this.calculateDuty(value),
    });
  }

  wrongValue(): boolean {
    return isNaN(this.state.value) || this.state.value < 0;
  }

  calculateDuty(_value: number): number {
    return 0;
  }

  render() {
    return (
      <div className="StampDuty">
        <img className="StampDuty_img" src={this.state.image} alt="" />
        <p className="StampDuty_content">
          <h3>
            Enter {this.state.dutiable} value:
            <input
              className={
                this.wrongValue()
                  ? "StampDuty_input StampDuty_error"
                  : "StampDuty_input"
              }
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <br />
          </h3>
          <h3>
            {!this.wrongValue() && <label>Stamp duty is {this.state.duty}</label>}
            {this.wrongValue() && (
              <p className="StampDuty_error-msg">
                Please enter a positive number.
              </p>
            )}
          </h3>
          <p>
            {this.state.url && (
              <div>
                See{" "}
                <a href={this.state.url}>
                  NSW {this.state.dutiable.charAt(0).toUpperCase()}
                  {this.state.dutiable.substring(1)} Duty Rates
                </a>
              </div>
            )}
          </p>
        </p>
      </div>
    );
  }
}

export default StampDuty;
