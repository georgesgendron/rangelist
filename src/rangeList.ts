// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range list is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

/**
 * A Range is an array of 2 numbers
 */
type Range = [number, number];

/**
 *
 * NOTE: Feel free to add any extra member variables/functions you like.
 */

export class RangeList {

  ranges: Range[] = [];

  /**
   * Adds a range to the list
   * @param {Range} range - Array of two integers that specify beginning and end of range.
   */
  add(range: Range) {
    if (range[0] >= range[1]) {
      console.info(`Invalid range ignored: ${range}`);
    } else {
      let merged = false;
      for (let i = 0; i < this.ranges.length; i++) {
        // if it starts before the end of existing range and ends before the start of an existing range...
        if (range[0] <= this.ranges[i][1] && range[1] >= this.ranges[i][0]) {
          // merge those 2 ranges
          merged = true;
          let mergedRange: Range = [
              Math.min(range[0], this.ranges[i][0]), Math.max(range[1], this.ranges[i][1])
          ];
          this.ranges[i] = mergedRange;

          // now, if we overlap with the next ranges, we'll need to merge with them
          while (i < this.ranges.length - 1) {
            if (mergedRange[0] <= this.ranges[i+1][1] && mergedRange[1] >= this.ranges[i+1][0]) {
              mergedRange[1] = Math.max(mergedRange[1], this.ranges[i+1][1]); // only need to extend the end
              this.ranges.splice(i + 1, 1);
            } else {
              break;
            }
          }
        }
      }
      if (!merged) {
        this.ranges.push(range);
        this.ranges.sort((r1, r2) => r1[0] - r2[0]);
      }
    }
  }

  /**
   * Removes a range from the list
   * @param {Range} range - Array of two integers that specify beginning and end of range.
   */
  remove(range: Range) {
    if (range[0] >= range[1]) {
      console.info(`Invalid range ignored: ${range}`);
    } else {
      let i = 0;
      while (i < this.ranges.length) {
        // if it starts before the end of existing range and ends before the start of an existing range...
        if (range[0] <= this.ranges[i][1] && range[1] >= this.ranges[i][0]) {
          if (range[0] <= this.ranges[i][0]) { // range to delete starts at or before existing
            if (range[1] >= this.ranges[i][1]) { // complete overlap, delete range
              this.ranges.splice(i, 1);
              continue;
            } else { // make existing range start at end of range to remove
              this.ranges[i][0] = range[1];
              i++;
              continue;
            }
          } else { // range to delete starts inside existing range
            let savedRange = this.ranges[i].map((x) => x); // deep copy so we can modify existing range object
            this.ranges[i][1] = range[0]; // make existing range end here
            if (range[1] < savedRange[1]) { // "hole" in existing range, need trim existing, and insert new range
              this.ranges.splice(i+1, 0, [range[1], savedRange[1]]); // insert new range
              break;
            }
          }
        }
        i++;
      }

    }
  }

  /**
   * Prints out the list of ranges in the range list
   */
  print(): string {
    return this.ranges.length === 0 ? "" : "["  + this.ranges.map((r) => r[0] + ", " + r[1]).join(") [") + ")";
  }
}
