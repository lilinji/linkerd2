import { expect } from 'chai';
import { metricToFormatter, styleNum, toClassName } from '../js/components/util/Utils.js';

// introduce some binary floating point rounding errors, like ya do
function float(num) {
  return num * 0.1 * 10;
}

describe('Utils', () => {
  describe('styleNum', () => {
    it('properly formats numbers', () => {
      let compare = (f, s) => expect(styleNum(float(f))).to.equal(s);
      compare(          1,          "1"       );
      compare(          2.20,       "2.2"     );
      compare(          3,          "3"       );
      compare(          4.4,        "4.4"     );
      compare(          5.0000001,  "5"       );
      compare(          7.6666667,  "7.67"    );
      compare(        123.456,      "123.46"  );
      compare(       1212.999999,   "1.2k"    );
      compare(       5329.333333,   "5.3k"    );
      compare(      16384.888,      "16.4k"   );
      compare(     131042,          "131k"    );
      compare(    1048576,          "1M"      );
      compare(    2097152.1,        "2.1M"    );
      compare(   16777216,          "16.8M"   );
      compare(  536870912,          "536.9M"  );
      compare( 1073741824,          "1.1G"    );
      compare(68719476736,          "68.7G"   );
    });

    it('properly formats numbers with units and no truncation', () => {
      let compare = (f, s) => expect(styleNum(float(f), " RPS", false)).to.equal(s);
      compare(          1,          "1 RPS"               );
      compare(          2.20,       "2.2 RPS"             );
      compare(          3,          "3 RPS"               );
      compare(          4.4,        "4.4 RPS"             );
      compare(          5.0000001,  "5 RPS"               );
      compare(          7.6666667,  "7.67 RPS"            );
      compare(        123.456,      "123.46 RPS"          );
      compare(       1212.999999,   "1,213 RPS"           );
      compare(       5329.333333,   "5,329 RPS"           );
      compare(      16384.888,      "16,385 RPS"          );
      compare(     131042,          "131,042 RPS"         );
      compare(    1048576,          "1,048,576 RPS"       );
      compare(    2097152.1,        "2,097,152 RPS"       );
      compare(   16777216,          "16,777,216 RPS"      );
      compare(  536870912,          "536,870,912 RPS"     );
      compare( 1073741824,          "1,073,741,824 RPS"   );
      compare(68719476736,          "68,719,476,736 RPS"  );
    });
  });

  describe('Metric Formatters', () => {
    it('formats undefined input', () => {
      let undefinedMetric;
      expect(metricToFormatter["REQUEST_RATE"](undefinedMetric)).to.equal('---');
      expect(metricToFormatter["SUCCESS_RATE"](undefinedMetric)).to.equal('---');
      expect(metricToFormatter["LATENCY"](undefinedMetric)).to.equal('---');
    });

    it('formats requests with rounding and unit', () => {
      expect(metricToFormatter["REQUEST_RATE"](99)).to.equal('99 RPS');
      expect(metricToFormatter["REQUEST_RATE"](999)).to.equal('999 RPS');
      expect(metricToFormatter["REQUEST_RATE"](1000)).to.equal('1k RPS');
      expect(metricToFormatter["REQUEST_RATE"](4444)).to.equal('4.4k RPS');
      expect(metricToFormatter["REQUEST_RATE"](9999)).to.equal('10k RPS');
      expect(metricToFormatter["REQUEST_RATE"](99999)).to.equal('100k RPS');
    });

    it('formats subsecond latency as ms', () => {
      expect(metricToFormatter["LATENCY"](99)).to.equal('99 ms');
      expect(metricToFormatter["LATENCY"](999)).to.equal('999 ms');
    });

    it('formats latency greater than 1s as s', () => {
      expect(metricToFormatter["LATENCY"](1000)).to.equal('1.000 s');
      expect(metricToFormatter["LATENCY"](9999)).to.equal('9.999 s');
      expect(metricToFormatter["LATENCY"](99999)).to.equal('99.999 s');
    });

    it('formats success rate', () => {
      expect(metricToFormatter["SUCCESS_RATE"](0.012345)).to.equal('1.23%');
      expect(metricToFormatter["SUCCESS_RATE"](0.01)).to.equal('1.00%');
      expect(metricToFormatter["SUCCESS_RATE"](0.1)).to.equal('10.00%');
      expect(metricToFormatter["SUCCESS_RATE"](0.9999)).to.equal('99.99%');
      expect(metricToFormatter["SUCCESS_RATE"](4)).to.equal('400.00%');
    });
  });

  describe('toClassName', () => {
    it('converts a string to a valid class name', () => {
      expect(toClassName('')).to.equal('');
      expect(toClassName('---')).to.equal('');
      expect(toClassName('foo/bar/baz')).to.equal('foo_bar_baz');
      expect(toClassName('FOOBAR')).to.equal('foobar');
      expect(toClassName('FooBar')).to.equal('foo_bar');

      // the perhaps unexpected number of spaces here are due to the fact that
      // _.lowerCase returns space separated words
      expect(toClassName('potato123yam0squash')).to.equal('potato_123_yam_0_squash');
      expect(toClassName('test/potato-e1af21-f3f3')).to.equal('test_potato_e_1_af_21_f_3_f_3');
    });
  });
});
