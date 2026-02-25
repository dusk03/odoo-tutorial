import { useRef, onMounted } from "@odoo/owl";

/**
 * Custom hook to automatically focus an element when component is mounted
 * @param {string} refName - The name of the t-ref in the template
 * @returns {Object} - The ref object
 */
export function useAutofocus(refName) {
  const ref = useRef(refName);

  onMounted(() => {
    if (ref.el) {
      ref.el.focus();
    }
  });

  return ref;
}
