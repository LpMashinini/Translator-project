import { useRef, useState } from "react"
import "../Translator/Translator.css"

const Translator = () => {

    const [userValue, setUserValue] = useState("");
    const [language, setLanguage] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const langRef = useRef();

    // handles textarea of user text
    const handleTextArea = (e) => {
        setUserValue(e.target.value)
    }

    // Submit button function
    const handleSubmit = async (e) => {

        e.preventDefault();


        const translatedText = await translateText(
            {
                inputLanguage: "auto",
                inputTextValue: userValue.trim(),
                outputLanguage: langRef.current.options[langRef.current.selectedIndex].value
            });

        if (!userValue) {
            alert("Please enter a text to be translated")
            setTranslatedText("");
        } else if (!language || language === "--select a language--") {
            alert("Please select a language")
            setTranslatedText("");
            setUserValue("");
        }

        console.log("Translated Text : ", translatedText);

        setTranslatedText(translatedText)

    }

    // Handles translation of text using google api
    const translateText = async ({ inputLanguage, inputTextValue, outputLanguage }) => {

        const api = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputTextValue)}`;


        try {

            const res = await fetch(api)

            if (!res.ok) {
                throw new Error(`Translation failed: ${res.statusText}`);
            }

            const data = await res.json();

            return data[0][0][0];


        } catch (error) {
            console.error("Error:", error);
            return "Translation failed. Please try again.";
        }


    }


    return (

        <div className="container">

            <h1 className="title">Polyglot</h1>

            <select ref={langRef} value={language} onChange={(e) => setLanguage(e.target.value)} className="select-con">
                <option>--select a language--</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="tn">Setswana</option>
                <option value="af">Afrikaans</option>
                <option value="zu">Zulu</option>
            </select>

            <div className="input-container">

                <div className="translator">
                    <textarea className="text-area"
                        value={translatedText}
                        readOnly />
                </div>

                <div className="text">
                    <textarea className="text-area"
                        value={userValue}
                        onChange={handleTextArea}
                        placeholder="Enter any text here..."
                    />
                </div>

            </div>

            <div className="btn">
                <button disabled={!userValue || !language ? "btn-d" : ""}  onClick={handleSubmit}>Translate</button>
            </div>

        </div>
    )
}

export default Translator
