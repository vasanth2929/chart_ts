module.exports = {
    parseJson: (data) => {
        try {
            if (typeof data === 'string') {
                console.log(data)
                return JSON.parse(data);
            }
            else {
                return data;
            }
        } catch (error) {
            console.log(error)
            console.error("please provide options in json format")
            return null
        }
    }
}
