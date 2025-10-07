import { BaseQuestionRenderer } from "./BaseQuestionRenderer.js";
import { RENDER_TYPES } from "../utils.js";

// questionData structure:
// {
//   question: "Select the correct options",
//   answer: [
//     {
//       name: "Dropdown 1",
//       options: ["Option 1", "Option 2", "Option 3"]
//     correct: "opt1A"
//    },
//     {
//       name: "Dropdown 2",
//       options: ["Option A", "Option B", "Option C"]
//       correct: "opt2B"
//     },
//    ]
// }
export class DropDownChoiceRenderer extends BaseQuestionRenderer {
  getType() {
    return RENDER_TYPES.DROPDOWN_CHOICE;
  }

  render(question, currentAnswer, questionIndex) {
    // Expected new format:
    // question.answer = [ { name: string, options: Array<string|{value,text}>, correct?: string } , ...]
    const dropdownDefs = Array.isArray(question.answer) ? question.answer : [];
    const answerMap =
      currentAnswer && typeof currentAnswer === "object" ? currentAnswer : {};

    const dropdownsHtml = dropdownDefs
      .map((dd, idx) => {
        const name = dd.name || `dropdown_${idx}`;
        const selected = answerMap[name] || "";
        const optionStartTag = `<option class="dropdown-option"`;
        const optionsHtml = [
          `${optionStartTag} value="">Select an option</option>`,
          ...(Array.isArray(dd.options) ? dd.options : []).map((opt) => {
            const value =
              typeof opt === "object" ? (opt.value ?? opt.text ?? "") : opt;
            const label =
              typeof opt === "object" ? (opt.text ?? opt.value ?? "") : opt;
            const sel = value === selected ? " selected" : "";
            return `<option class="dropdown-option" value="${this.escapeHtml(String(value))}"${sel}>${this.escapeHtml(String(label))}</option>`;
          }),
        ].join("");
        return `
          <div class="dropdown-wrapper">
            <label class="dropdown-label" for="${this.escapeHtml(name)}">${this.escapeHtml(name)}</label>
            <select class="dropdown-select generic-style-button" name="${this.escapeHtml(name)}" id="${this.escapeHtml(name)}">
              ${optionsHtml}
            </select>
          </div>`;
      })
      .join("");

    const answersHTML = `<div class="dropdown-container">${dropdownsHtml}</div>`;
    return this.createQuestionHTML(question, questionIndex, answersHTML);
  }
  getAnswer(container) {
    if (!container) return {};
    const selects = container.querySelectorAll(".dropdown-select");
    const answers = {};
    selects.forEach((select) => {
      answers[select.name] = select.value;
    });
    return answers;
  }
  setAnswer(container, answers) {
    if (!container || typeof answers !== "object" || answers === null) return;
    const selects = container.querySelectorAll(".dropdown-select");
    selects.forEach((select) => {
      if (Object.prototype.hasOwnProperty.call(answers, select.name)) {
        select.value = answers[select.name];
      }
    });
  }
  validateAnswer(answers) {
    if (typeof answers !== "object" || answers === null) return false;
    // Must have at least one key and no empty selections
    const values = Object.values(answers);
    if (!values.length) return false;
    return values.every((v) => v !== "");
  }
}
