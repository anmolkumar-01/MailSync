
import { Quill } from 'react-quill';

// 1. Import the base Blot from Quill
const BlockEmbed = Quill.import('blots/block/embed');

// 2. Create the custom Blot class
class ComponentBlot extends BlockEmbed {
  // The 'create' method is called when a blot of this type is created.
  // 'value' is the data passed to insertEmbed.
  static create(value) {
    // 'super.create()' creates the base DOM node, which is a <div> in this case.
    const node = super.create();
    // Store the props for our React component as a JSON string in a data attribute.
    // This allows us to retrieve the data later.
    node.setAttribute('data-component-props', JSON.stringify(value));
    return node;
  }

  // The 'value' method returns the data representation of the blot.
  // When you get the contents of the editor, this is what will be returned for this blot.
  static value(node) {
    // Retrieve the props from the data attribute and parse them back into an object.
    return JSON.parse(node.getAttribute('data-component-props'));
  }
}

// 3. Configure the Blot's properties
ComponentBlot.blotName = 'my-component'; // The name that Quill will use to recognize this blot.
ComponentBlot.tagName = 'div'; // The HTML tag that will be used to represent this blot in the editor.
ComponentBlot.className = 'custom-component-container'; // A class for easier selection and styling.

// 4. Register the custom Blot with Quill
// This makes Quill aware of your new blot type so it can be used in the editor.
Quill.register(ComponentBlot);

// You don't need to export anything specific unless you want to,
// as Quill.register modifies the global Quill instance that ReactQuill uses.```
