/**
 * Created by uncle on 2017/3/4.
 */
const format = {
	/**
	 * 格式化数字 - 千分号  两位小数 四舍五入
	 * @param number 数值(numberber或者String)
	 * @type String
	 */
	currency(number) {
		number = number.toString().replace(/\$|\,/g, '');
		if (isNaN(number)) {
			number = "0";
		}
		let sign = (number == (number = Math.abs(number)));
		number = Math.floor(number * 100 + 0.50000000001);
		let cents = number % 100;
		number = Math.floor(number / 100).toString();
		if (cents < 10)
			cents = "0" + cents;
		for (let i = 0; i < Math.floor((number.length - (1 + i)) / 3); i++)
			number = number.substring(0, number.length - (4 * i + 3)) + ',' +
				number.substring(number.length - (4 * i + 3));
		return (((sign) ? '' : '-') + number + '.' + cents);
	},
	//格式化日期

};

export default format;





