# Quiz Web Page - Adding New Question Types

This document explains how to add new question types to the modular quiz system.

## Overview

The quiz system uses a plugin-based architecture where question types are implemented as renderer classes that extend the `BaseQuestionRenderer` abstract class.

## Steps to Add a New Question Type

### 1. Create a New Renderer Class

Create a new file in `src/renderers/` (e.g., `YourNewTypeRenderer.js`):

```javascript
import { BaseQuestionRenderer } from './BaseQuestionRenderer.js';

export class YourNewTypeRenderer extends BaseQuestionRenderer {
    getType() {
        return 'Your New Type'; // Must match the "type" field in JSON
    }

    render(question, currentAnswer, questionIndex) {
        // Create your custom HTML for the question
        const answersHTML = `
            <!-- Your custom HTML here -->
        `;
        
        return this.createQuestionHTML(question, questionIndex, answersHTML);
    }

    getAnswer(container) {
        // Extract the user's answer from the DOM
        // Return the answer in whatever format makes sense
        return null; // Replace with actual answer extraction
    }

    setAnswer(container, answer) {
        // Set the answer in the DOM (used when navigating back to a question)
        // Use the answer parameter to restore the previous state
    }

    validateAnswer(answer) {
        // Return true if the answer is valid, false otherwise
        return super.validateAnswer(answer); // Or your custom validation
    }
}
```

### 2. Register the New Renderer

In `src/QuizzRender.js`, import and register your new renderer:

```javascript
// Add the import
import { YourNewTypeRenderer } from './renderers/YourNewTypeRenderer.js';

// In the constructor, register it:
constructor() {
    this.renderers = new Map();
    this.currentRenderer = null;
    
    // Existing renderers
    this.registerRenderer('Multiple Choice', new MultipleChoiceRenderer());
    this.registerRenderer('Single Choice', new SingleChoiceRenderer());
    this.registerRenderer('Input', new InputRenderer());
    
    // Your new renderer
    this.registerRenderer('Your New Type', new YourNewTypeRenderer());
}
```

### 3. Update Your Quiz JSON

Use the new question type in your quiz data:

```json
{
    "name": "My Quiz",
    "Questions": [
        {
            "name": "Your question text?",
            "type": "Your New Type",
            "answer": ["data", "for", "your", "question"]
        }
    ]
}
```

## Available Methods in BaseQuestionRenderer

- `createQuestionHTML(question, questionIndex, answersHTML)` - Creates the base question structure
- `escapeHtml(text)` - Escapes HTML to prevent XSS attacks
- `validateAnswer(answer)` - Basic validation (checks for non-empty values)

## Examples

Look at the existing renderers for examples:
- `MultipleChoiceRenderer.js` - Checkboxes for multiple selections
- `SingleChoiceRenderer.js` - Radio buttons for single selection
- `InputRenderer.js` - Text input field

## Interactive Elements

If your question type needs interactive JavaScript, you can:
1. Add global functions to `main.js` (like `toggleMultipleChoice`)
2. Use `onclick` attributes in your HTML
3. Use `onchange` or other event attributes as needed

The renderer system will handle answer persistence automatically through the `getAnswer()` and `setAnswer()` methods.