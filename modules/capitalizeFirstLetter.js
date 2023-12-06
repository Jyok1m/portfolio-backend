const capitalizeFirstLetter = (value) => {
	if (!value || typeof value !== "string") return value;
	return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

module.exports = capitalizeFirstLetter;
