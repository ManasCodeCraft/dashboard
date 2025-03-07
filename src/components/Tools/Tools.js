import React, { useState, useEffect, useRef } from "react";
import Button from "../Button/Button";
import styles from "./Toolbox.module.css";

export default function Toolbox({ editorRef, textareaRef }) {
    const savebtnRef = useRef(null);
    const reloadbtnRef = useRef(null);
    
    const [loading, setLoading] = useState({ save: false, reload: false });

    const [buttonTexts, setButtonTexts] = useState({
        normal: "Normal",
        heading1: "Heading1",
        heading2: "Heading2",
        heading3: "Heading3",
        save: "Save",
        reload: "Reload",
    });

    useEffect(() => {
        getContent();
    }, []);

    useEffect(() => {
        const updateButtonText = () => {
            if (window.innerWidth < 770) {
                setButtonTexts({
                    normal: "N",
                    heading1: "H1",
                    heading2: "H2",
                    heading3: "H3",
                    save: "💾",
                    reload: "🔄",
                });
            } else if (window.innerWidth < 1060) {
                setButtonTexts({
                    normal: "Normal",
                    heading1: "H1",
                    heading2: "H2",
                    heading3: "H3",
                    save: "Save",
                    reload: "Reload",
                });
            } else {
                setButtonTexts({
                    normal: "Normal",
                    heading1: "Heading1",
                    heading2: "Heading2",
                    heading3: "Heading3",
                    save: "Save",
                    reload: "Reload",
                });
            }
        };

        updateButtonText();
        window.addEventListener("resize", updateButtonText);

        return () => window.removeEventListener("resize", updateButtonText);
    }, []);

    function removeParentIfHeadingOrParagraph(element) {
        while (element?.parentNode && ["H1", "H2", "H3", "P"].includes(element.parentNode.tagName)) {
            let parent = element.parentNode;
            if (parent.parentNode) {
                parent.parentNode.replaceChild(element, parent); // Keep the element but remove the parent
            } else {
                break; // Stop if there's no further parent
            }
        }
    }

    const applyFormat = (tag) => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.extractContents();

        const newElement = document.createElement(tag);
        newElement.appendChild(selectedText);

        range.insertNode(newElement);
        selection.removeAllRanges();

        removeParentIfHeadingOrParagraph(newElement);
        editorRef.current.focus();
    };

    const getContent = async () => {
        setLoading((prev) => ({ ...prev, reload: true }));
        try {
            const response = await fetch("https://thoughtsdashboard.pythonanywhere.com/get_content");
            const data = await response.json();
            textareaRef.current.innerHTML = data.content;
        } catch (error) {
            console.error("Error fetching content:", error);
        } finally {
            setLoading((prev) => ({ ...prev, reload: false }));
        }
    };

    const saveContent = async () => {
        setLoading((prev) => ({ ...prev, save: true }));
        try {
            const response = await fetch("https://thoughtsdashboard.pythonanywhere.com/update_content", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: textareaRef.current.innerHTML }),
            });

            const data = await response.json();
            console.log("Response:", data);
        } catch (error) {
            console.error("Error updating content:", error);
        } finally {
            setLoading((prev) => ({ ...prev, save: false }));
        }
    };

    return (
        <div className={styles.toolbox}>
            <Button text={buttonTexts.normal} onClick={() => applyFormat("p")} />
            <Button text={buttonTexts.heading1} onClick={() => applyFormat("h1")} />
            <Button text={buttonTexts.heading2} onClick={() => applyFormat("h2")} />
            <Button text={buttonTexts.heading3} onClick={() => applyFormat("h3")} />
            
            <Button 
                onClick={saveContent} 
                ref={savebtnRef}
                disabled={loading.save} 
                text={
                    <span className={loading.save ? styles.movingtext : ""}>
                        {buttonTexts.save}
                    </span>
                } 
            />

            <Button 
                onClick={getContent} 
                ref={reloadbtnRef} 
                disabled={loading.reload} 
                text={
                    <span className={loading.reload ? styles.movingtext : ""}>
                        {buttonTexts.reload}
                    </span>
                } 
            />
        </div>
    );
}
