import { ChangeEvent, Component } from "react";
import "./StampDuty.css";
import { formatDuty } from "./duty";

interface StampDutyState {
  value: number;
  duty: number;
  dutiable: string;
  url: string;
  image: string;
  assistance?: boolean;
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
      assistance: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAssistanceChange = this.handleAssistanceChange.bind(this);
  }

  hasAssistance(): boolean {
    return false;
  }

  assistanceLabel(): string {
    return "";
  }

  assistanceEnabled(): boolean {
    return this.state.assistance ?? false;
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    this.setState({
      value,
      duty: this.calculateDuty(value, this.assistanceEnabled()),
    });
  }

  handleAssistanceChange(event: ChangeEvent<HTMLInputElement>) {
    const assistance = event.target.checked;
    this.setState({
      assistance,
      duty: this.calculateDuty(this.state.value, assistance),
    });
  }

  wrongValue(): boolean {
    return isNaN(this.state.value) || this.state.value < 0;
  }

  calculateDuty(_value: number, _assistance: boolean): number {
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
            {this.hasAssistance() && (
              <label className="StampDuty_assistance">
                <input
                  type="checkbox"
                  checked={this.assistanceEnabled()}
                  onChange={this.handleAssistanceChange}
                />
                {this.assistanceLabel()}
              </label>
            )}
          </h3>
          <h3>
            {!this.wrongValue() && (
              <label>Stamp duty is {formatDuty(this.state.duty)}</label>
            )}
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
