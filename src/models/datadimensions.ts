import type { DataType } from "./datatypes";
export { DataDimension }

class DataDimension {
  aspects: number;
  channels: number;
  timesamples: number;
  polarizations: number;
  datatype: DataType;

  constructor(
    aspects: number,
    channels: number,
    timesamples: number,
    polarizations: number,
    datatype: DataType
  ) {
    this.aspects = aspects;
    this.channels = channels;
    this.timesamples = timesamples;
    this.polarizations = polarizations;
    this.datatype = datatype;
  }

  /**
   * copy
   */
  public copy() {
    return new DataDimension(
      this.aspects,
      this.channels,
      this.timesamples,
      this.polarizations,
      this.datatype.copy(),
    );
  }

  /**
    * bytesize: compute the number of bytes of this data
    */
  public bytesize():number {
    return this.aspects *
      this.channels *
      this.timesamples *
      this.polarizations *
      this.datatype.bytesize;
  }
}