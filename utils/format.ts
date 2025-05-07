import { FEET_IN_ONE_METER, ONE_MILE_IN_METERS } from "../constants";

export const formatRadius = (meters: number) => {
  const feet = meters * FEET_IN_ONE_METER;
  const miles = meters / ONE_MILE_IN_METERS;

  if (miles < 0.25) {
    return `${Math.round(feet)} ft`;
  } else {
    return `${miles.toFixed(1)} mi`;
  }
};
