import React, { useRef } from "react";
import styles from "./Textbox.module.css";
import Toolbox from "../Tools/Tools";

export default function Textbox() {
    const editorRef = useRef(null);
    const textareaRef = useRef(null);

    const handleKeyDown = (event) => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        var node = selection.anchorNode;

        if (node.nodeType === 3) {
            node = node.parentElement;
        }

        // Convert '*' to bullet list on space
        if (event.key === " " && node.textContent.endsWith("*")) {
            event.preventDefault();
            node.textContent = node.textContent.slice(0, -1); // Remove "*"

            const ul = document.createElement("ul");
            const li = document.createElement("li");
            li.textContent = node.textContent.trim(); // Move text into list item
            ul.appendChild(li);

            range.deleteContents();
            range.insertNode(ul);

            // Move cursor inside new list item
            const newRange = document.createRange();
            newRange.setStart(li, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }

        // Handle Enter key for lists
        if (event.key === "Enter") {
            const parentLi = node.parentElement?.closest("li");
            if (parentLi) {
                event.preventDefault();

                if (parentLi.textContent.trim() === "") {
                    // Remove empty bullet point
                    const ul = parentLi.closest("ul");
                    ul.remove();
                } else {
                    // Create new bullet point
                    const newLi = document.createElement("li");
                    parentLi.parentNode.appendChild(newLi);

                    // Move cursor inside new list item
                    const newRange = document.createRange();
                    newRange.setStart(newLi, 0);
                    newRange.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            }
        }

        // Handle Tab key to insert a tab space instead of changing focus
        if (event.key === "Tab") {
            event.preventDefault();

            const tabNode = document.createTextNode("\u00A0\u00A0\u00A0\u00A0"); // 4 spaces

            range.insertNode(tabNode);
            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    return (
        <>
            <Toolbox editorRef={editorRef} textareaRef={textareaRef} />
            <div className={styles.container} ref={editorRef}>
                <div
                    className={styles.textarea}
                    ref={textareaRef}
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    placeholder="Start typing..."
                    onKeyDown={handleKeyDown}
                ></div>
            </div>
        </>
    );
}
