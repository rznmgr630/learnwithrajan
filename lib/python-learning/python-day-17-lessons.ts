import type { LessonDay, LessonQuizQuestion } from "@/lib/learn/lesson-types";

const same = (en: string) => ({ en, np: en, jp: en });
const q = (question: string, options: string[], correctIndex: number, explanation: string): LessonQuizQuestion => ({ question: same(question), options: options.map(same), correctIndex, explanation: same(explanation) });

export const PYTHON_DAY_17_LESSONS: LessonDay = {
  day: 17,
  label: same("Day 17 · Phase 2 · Objects"),
  title: same("Encapsulation & Properties"),
  overview: same("Learn about encapsulation, properties, getters/setters, and static/class methods to enhance your Python code's structure and maintainability."),
  totalMinutes: 120,
  difficulty: same("Intermediate"),
  lessons: [
    {
      id: "python-day-17-encapsulation",
      title: same("Encapsulation and Naming Conventions"),
      durationMinutes: 30,
      explanation: same("<b>Encapsulation:</b> Encapsulation is the practice of hiding the internal representation of an object and exposing only necessary details through public interfaces. This helps in maintaining data integrity and preventing accidental modification.\n\n<b>Naming Conventions:</b> Use descriptive names for attributes and methods to make your code readable and maintainable. Follow PEP 8 guidelines for consistent naming conventions."),
      diagram: "Encapsulation\n  │\n  ├─ Private Attributes\n  │  └─ Protected Attributes\n  │\n  └─ Public Methods\n          │\n          ▼\n     Exposes only necessary details",
      codeExample: { title: same("Encapsulation Example"), code: `
class DeliveryTracker:
    def __init__(self, package_id: str, status: str):
        self.__package_id = package_id  # Private attribute
        self._status = status           # Protected attribute

    def get_package_id(self) -> str:
        return self.__package_id

    def set_status(self, new_status: str):
        self._status = new_status

    def print_status(self):
        if self._status == "packed":
            print(f"{self.get_package_id()} is ready for dispatch")
        else:
            print(f"{self.get_package_id()} needs review")
      `, details: same("Use `__` before an attribute name to make it private. Use `_` to indicate protected attributes.") },
      keyTakeaways: [same("Private attributes should not be accessed directly."), same("Protected attributes can be accessed but should not be modified outside the class."), same("Public methods provide controlled access to private and protected attributes.")],
      commonMistakes: [same("<b>Accessing private attributes directly.</b> This can lead to bugs and violates encapsulation principles."), same("<b>Overusing public attributes.</b> Expose only what is necessary to maintain data integrity.")],
      quiz: [q("What does `__` before an attribute name signify?", ["Private attribute", "Protected attribute", "Public attribute", "Static attribute"], 0, "Private attributes cannot be accessed directly from outside the class."), q("Which method allows controlled access to a private attribute?", ["`__get_attribute()`", "`get_attribute()`", "`set_attribute()`", "`print_attribute()`"], 0, "Public methods like `get_package_id()` allow controlled access to private attributes.")],
    },
    {
      id: "python-day-17-properties",
      title: same("Properties and Getters/Setters"),
      durationMinutes: 30,
      explanation: same("<b>Properties:</b> Properties are a way to implement custom accessors for attributes. They provide a way to control the behavior of accessing and modifying attributes. <b>Getters</b> and <b>Setters</b> are used to add validation or side effects when getting or setting an attribute.\n\n<b>@property decorator:</b> Used to create a getter method. <b>@<attribute_name>.setter decorator:</b> Used to create a setter method."),
      diagram: "Property Decorators\n  │\n  ├─ @property\n  │  └─ Getter Method\n  │\n  └─ @<attribute_name>.setter\n          │\n          ▼\n     Setter Method",
      codeExample: { title: same("Properties Example"), code: `
class DeliveryTracker:
    def __init__(self, package_id: str, status: str):
        self.__package_id = package_id
        self._status = status

    @property
    def package_id(self):
        return self.__package_id

    @package_id.setter
    def package_id(self, new_id: str):
        if len(new_id) > 5:
            raise ValueError("Package ID must be less than 6 characters.")
        self.__package_id = new_id

    def print_status(self):
        if self._status == "packed":
            print(f"{self.package_id} is ready for dispatch")
        else:
            print(f"{self.package_id} needs review")
      `, details: same("The `@property` decorator creates a getter method, and the `@<attribute_name>.setter` decorator creates a setter method. These methods provide validation and side effects.") },
      keyTakeaways: [same("Properties provide a way to control access to attributes."), same("Getters and setters add validation or side effects when accessing or modifying attributes."), same("Use properties for complex attribute behavior.")],
      commonMistakes: [same("<b>Not using validation in setters.</b> This can lead to invalid state in your objects."), same("<b>Misusing properties for simple attribute access.</b> Properties are useful for complex behaviors, not just simple access.")],
      quiz: [q("What is the purpose of the `@property` decorator?", ["To create a getter method", "To create a setter method", "To create a property", "To create a method"], 0, "The `@property` decorator creates a getter method."), q("Which decorator would you use to validate input before setting an attribute?", ["`@<attribute_name>.getter`", "`@<attribute_name>.setter`", "`@property`", "`@classmethod`"], 0, "The `@<attribute_name>.setter` decorator allows you to validate input before setting an attribute.")],
    },
    {
      id: "python-day-17-static-class-method",
      title: same("Static and Class Methods"),
      durationMinutes: 30,
      explanation: same("<b>Static Methods:</b> These methods belong to the class rather than an instance of the class. They are used for utility functions that do not require access to any class or instance attributes.\n\n<b>Class Methods:</b> These methods belong to the class and take `cls` as their first parameter, which refers to the class itself. They are often used for factory methods or when you want to create instances of a class in a specific way."),
      diagram: "Static and Class Methods\n  │\n  ├─ @staticmethod\n  │  └─ Utility Function\n  │\n  └─ @classmethod\n          │\n          ▼\n     Factory Method",
      codeExample: { title: same("Static and Class Methods Example"), code: `
class DeliveryTracker:
    count = 0

    def __init__(self, package_id: str, status: str):
        self.__package_id = package_id
        self._status = status
        DeliveryTracker.count += 1

    @staticmethod
    def is_valid_id(id: str) -> bool:
        return len(id) <= 5

    @classmethod
    def from_status(cls, package_id: str, status: str) -> 'DeliveryTracker':
        if cls.is_valid_id(package_id):
            return cls(package_id, status)
        else:
            raise ValueError("Invalid package ID")

    def print_status(self):
        if self._status == "packed":
            print(f"{self.package_id} is ready for dispatch")
        else:
            print(f"{self.package_id} needs review")
      `, details: same("Static methods do not have access to `cls` or `self`. Class methods have access to `cls` but not `self`. Both can be called on the class itself.") },
      keyTakeaways: [same("Static methods are utility functions that do not depend on class state."), same("Class methods are used for creating instances or manipulating class-level data."), same("Use static methods for functions that do not need to interact with class or instance attributes.")],
      commonMistakes: [same("<b>Misusing static methods for instance behavior.</b> Static methods should not reference instance attributes."), same("<b>Not using class methods for factory patterns.</b> Class methods are ideal for creating instances in specific ways.")],
      quiz: [q("What does a static method belong to?", ["The class", "An instance", "Both the class and an instance", "Neither"], 0, "Static methods belong to the class and do not have access to instance or class attributes."), q("Which method would you use to create a new `DeliveryTracker` instance based on status?", ["`__init__`", "`from_status`", "`print_status`", "`is_valid_id`"], 0, "The `from_status` class method creates a new instance based on given parameters.")],
    },
    {
      id: "python-day-17-practice-project",
      title: same("Practice Project"),
      durationMinutes: 30,
      explanation: same("Apply what you've learned by creating a more complex delivery tracker application. Use encapsulation, properties, and static/class methods to build a robust system."),
      diagram: "Practice Project\n  │\n  ├─ Encapsulation\n  │  └─ Properties\n  │\n  └─ Static/Class Methods\n          │\n          ▼\n     Robust Delivery Tracker Application",
      codeExample: { title: same("Practice Project Code"), code: `
class DeliveryTracker:
    count = 0

    def __init__(self, package_id: str, status: str):
        self.__package_id = package_id
        self._status = status
        DeliveryTracker.count += 1

    @property
    def package_id(self):
        return self.__package_id

    @package_id.setter
    def package_id(self, new_id: str):
        if len(new_id) > 5:
            raise ValueError("Package ID must be less than 6 characters.")
        self.__package_id = new_id

    @staticmethod
    def is_valid_id(id: str) -> bool:
        return len(id) <= 5

    @classmethod
    def from_status(cls, package_id: str, status: str) -> 'DeliveryTracker':
        if cls.is_valid_id(package_id):
            return cls(package_id, status)
        else:
            raise ValueError("Invalid package ID")

    def print_status(self):
        if self._status == "packed":
            print(f"{self.package_id} is ready for dispatch")
        else:
            print(f"{self.package_id} needs review")

# Usage example
tracker = DeliveryTracker.from_status("PKG-42", "packed")
tracker.print_status()
      `, details: same("Create a robust delivery tracker application using encapsulation, properties, and static/class methods.") },
      keyTakeaways: [same("Combine encapsulation, properties, and static/class methods to build robust applications."), same("Use static methods for utility functions and class methods for factory patterns or class-level operations.")],
      commonMistakes: [same("<b>Misusing properties and static/class methods.</b> Ensure you use them appropriately for encapsulation and utility functions."), same("<b>Not testing your implementation thoroughly.</b> Test all aspects of your application to ensure it works as expected.")],
      quiz: [q("What is the purpose of a class method?", ["To perform operations on class-level data", "To modify instance attributes", "To perform operations on instance attributes", "To modify static attributes"], 0, "Class methods operate on class-level data and can be used for factory patterns or other class-level operations.")],
    },
  ],
  finalQuiz: [
    q("Which decorator is used to create a getter method for an attribute?", ["`@property`", "`@setter`", "`@getter`", "`@classmethod`"], 0, "The `@property` decorator creates a getter method."),
    q("What does a static method belong to?", ["The class", "An instance", "Both the class and an instance", "Neither"], 0, "Static methods belong to the class and do not have access to instance or class attributes."),
    q("Which method would you use to validate a package ID before setting it?", ["`__package_id`", "`package_id`", "`set_package_id`", "`@package_id.setter`"], 0, "The `@package_id.setter` decorator allows you to validate input before setting an attribute."),
    q("Why might you use a class method?", ["To perform operations on class-level data", "To modify instance attributes directly", "To create instances in a specific way", "To create utility functions that depend on instance attributes"], 0, "Class methods are used for creating instances or manipulating class-level data."),
    q("What is the main benefit of using properties in Python?", ["To enhance code readability", "To control access to attributes", "To improve performance", "To simplify method calls"], 0, "Properties provide a way to control access to attributes and can include validation and side effects."),
    q("Which statement correctly describes encapsulation?", ["Encapsulation hides implementation details from external access", "Encapsulation exposes all internal attributes directly", "Encapsulation allows direct modification of private attributes", "Encapsulation makes all methods public"], 0, "Encapsulation is about hiding internal representation and exposing only necessary details through public interfaces."),
  ],
  project: {
    name: same("Robust Delivery Tracker"),
    goal: same("Create a delivery tracker application with encapsulation, properties, and static/class methods."),
    brief: same("Build a more complex delivery tracker application that uses encapsulation to hide internal details, properties to control attribute access, and static/class methods for utility functions and factory patterns."),
    steps: [same("Define a `DeliveryTracker` class with encapsulated attributes and properties."), same("Implement static methods for utility functions like ID validation."), same("Use class methods to create instances based on status."), same("Ensure the class has methods to print status and handle errors."), same("Test the application thoroughly to ensure all features work as expected.")],
    acceptance: [same("The application uses encapsulation to hide internal details."), same("Properties control access to attributes with validation."), same("Static methods validate IDs and other utilities."), same("Class methods create instances based on given parameters."), same("The application handles errors gracefully and prints status correctly.")],
    stretch: [same("Add a method to log events to a file or database."), same("Implement a GUI interface for the delivery tracker application."), same("Integrate with a real API to fetch delivery statuses.")]
  },
};
