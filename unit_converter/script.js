document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const convertButton = document.getElementById("convert");
    const resetButton = document.getElementById("reset");
    const resultDiv = document.getElementById("result");
    const output = document.getElementById("output");
    const inputField = document.getElementById("input");
    const fromField = document.getElementById("from");
    const toField = document.getElementById("to");
    let selectedType = 'length'
    tabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
            e.preventDefault()
            selectedType = e.target.getAttribute('data-type')
            tabs.forEach(t => t.classList.remove('active'))
            tab.classList.add("active");
        });
    });

    convertButton.addEventListener("click", () => {
        const inputValue = parseFloat(inputField.value);
        const fromValue = fromField.value.trim().toLowerCase();
        const toValue = toField.value.trim().toLowerCase();

        let result
        if (selectedType === 'length') {
            if (fromValue === 'ft' && toValue === 'cm') {
                result = inputValue * 30.48
            } else if (fromValue === 'cm' && toValue === 'ft') {
                result = inputValue / 30.48
            } else if (fromValue === 'ft' && toValue === 'm') {
                result = inputValue * 0.3048
            } else if (fromValue === 'm' && toValue === 'ft') {
                result = inputValue / 0.3048
            } else if (fromValue === 'cm' && toValue === 'm') {
                result = inputValue
            }

        } else if (selectedType === 'weight') {
            if (fromValue === '' && toValue === '') {

            }
        } else if (selectedType === 'temperature' && (fromValue === '' && toValue === '')) {

        }
        if (result !== undefined) {
            output.innerHTML = `${inputValue} ${fromValue} = ${result.toFixed(2)} ${toValue}`
            resultDiv.classList.remove('hidden')
        }
    });

    resetButton.addEventListener('click', () => {
        inputField.value = ""
        fromField.value = ''
        toField.value = ''
        resultDiv.classList.add('hidden')
    })
});

