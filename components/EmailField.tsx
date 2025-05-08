export default function EmailField() {
  <TextInput
    style={styles.input}
    placeholder="Email *"
    value={email}
    onChangeText={(text) => {
      setEmail(text);
      if (error) setError(""); // clear error on change
    }}
    onBlur={() => {
      const trimmed = email.trim();
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

      if (!trimmed) {
        setError("Email is required.");
      } else if (!isValidEmail) {
        setError("Please enter a valid email address.");
      }
    }}
  />;
}
