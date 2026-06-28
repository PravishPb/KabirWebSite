# Project Rules for Kabir Association Website

## Mobile Date Picker Behavior
When using any HTML5 date input (`<input type="date">` or `<input type="datetime-local">`) in frontend filters, lists, or client-side views:
- **Rule**: Always specify the `min` and `max` attributes dynamically based on the actual range of dataset dates.
- **Why**: Native calendar wheels/pickers on mobile devices (iOS/Android) default to the current day. If a dataset only contains historical items (e.g. 2017–2021), restricting the calendar bounds to the dataset's actual boundaries prevents users from having to scroll back through several irrelevant years.
- **Implementation**: Calculate the minimum and maximum dates dynamically using `Math.min`/`Math.max` over the array elements, format them as `YYYY-MM-DD`, and bind them to the input attributes.
