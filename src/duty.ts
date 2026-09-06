const MIN_TRANSFER_DUTY = 20;

export function calculateHomeDuty(value: number): number {
  if (value <= 18000) {
    return Math.max(MIN_TRANSFER_DUTY, (value * 1.25) / 100);
  }
  if (value <= 38000) {
    return 225 + (1.5 * (value - 18000)) / 100;
  }
  if (value <= 103000) {
    return 525 + (1.75 * (value - 38000)) / 100;
  }
  if (value <= 387000) {
    return 1662 + (3.5 * (value - 103000)) / 100;
  }
  if (value <= 1290000) {
    return 11602 + (4.5 * (value - 387000)) / 100;
  }
  if (value <= 3870000) {
    return 52237 + (5.5 * (value - 1290000)) / 100;
  }
  return 194137 + (7.0 * (value - 3870000)) / 100;
}

const FHBA_HOME_EXEMPTION = 800000;
const FHBA_HOME_CEILING = 1000000;

export function calculateHomeDutyWithFhbas(value: number): number {
  if (value <= 0) {
    return 0;
  }
  if (value <= FHBA_HOME_EXEMPTION) {
    return 0;
  }
  if (value < FHBA_HOME_CEILING) {
    const fullDuty = calculateHomeDuty(value);
    const dutyAtExemption = calculateHomeDuty(FHBA_HOME_EXEMPTION);
    const taper = (FHBA_HOME_CEILING - value) / (FHBA_HOME_CEILING - FHBA_HOME_EXEMPTION);
    return fullDuty - dutyAtExemption * taper;
  }
  return calculateHomeDuty(value);
}

const VEHICLE_DUTY_THRESHOLD = 45000;

export function calculateMotorVehicleDuty(value: number): number {
  if (value < VEHICLE_DUTY_THRESHOLD) {
    return (3 * value) / 100;
  }
  return 1350 + (5 * (value - VEHICLE_DUTY_THRESHOLD)) / 100;
}

export function formatDuty(duty: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(duty);
}