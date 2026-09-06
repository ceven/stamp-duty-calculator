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
  expanded?: boolean;
}

export interface DutyTableRow {
  range: string;
  duty: string;
}

export interface DutyTable {
  caption: string;
  rows: DutyTableRow[];
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
    this.handleToggleExpanded = this.handleToggleExpanded.bind(this);
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

  isExpanded(): boolean {
    return this.state.expanded ?? false;
  }

  handleToggleExpanded() {
    this.setState({ expanded: !this.isExpanded() });
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

  dutyTable(): DutyTable | null {
    return null;
  }

  cardClassName(): string {
    return "";
  }

  render() {
    const table = this.dutyTable();
    return (
      <div className={`StampDuty ${this.cardClassName()}`}>
        <img className="StampDuty_img" src={this.state.image} alt="" />
        <div className="StampDuty_content">
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
            {this.hasAssistance() && (
              <label className="StampDuty_assistance">
                <input
                  type="checkbox"
                  checked={this.assistanceEnabled()}
                  onChange={this.handleAssistanceChange}
                />
                <span>{this.assistanceLabel()}</span>
              </label>
            )}
          </h3>
          <h3>
            {!this.wrongValue() && (
              <label className="StampDuty_result">
                Stamp duty is {formatDuty(this.state.duty)}
              </label>
            )}
            {this.wrongValue() && (
              <p className="StampDuty_error-msg">
                Please enter a positive number.
              </p>
            )}
          </h3>
          <div>
            {this.state.url && (
              <div>
                See{" "}
                <a href={this.state.url}>
                  NSW {this.state.dutiable.charAt(0).toUpperCase()}
                  {this.state.dutiable.substring(1)} Duty Rates
                </a>
              </div>
            )}
          </div>
        </div>
        {table && (
          <table className="StampDuty_table">
            <thead>
              <tr>
                <th>
                  <button
                    type="button"
                    className="StampDuty_toggle"
                    onClick={this.handleToggleExpanded}
                    aria-expanded={this.isExpanded()}
                  >
                    <span>{table.caption}</span>
                    <span
                      className={`StampDuty_toggle-icon${
                        this.isExpanded() ? " StampDuty_toggle-icon--open" : ""
                      }`}
                      aria-hidden="true"
                    >
                      ▼
                    </span>
                  </button>
                </th>
              </tr>
            </thead>
            {this.isExpanded() && (
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.range}>
                    <td>{row.range}</td>
                    <td>{row.duty}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        )}
      </div>
    );
  }
}

export default StampDuty;
