# Import necessary libraries
import json

# Class to represent a student
class Student:
    def __init__(self, serial_no, name, phone_no, dob):
        self.serial_no = serial_no
        self.name = name
        self.phone_no = phone_no
        self.dob = dob

# Function to display the list of students
def display_students(students):
    print(f"{'S.No':<5} {'Name':<20} {'Phone No':<15} {'DOB':<15} {'View Full Details':<20}")
    for student in students:
        print(f"{student.serial_no:<5} {student.name:<20} {student.phone_no:<15} {student.dob:<15} {'View'}")

# Function to save student information to a file
def save_to_file(students, filename):
    with open(filename, 'w') as f:
        json_data = [student.__dict__ for student in students]
        json.dump(json_data, f, indent=4)

# Main function
def main():
    students = []

    # Sample data input - In practice, you would collect this data from a form or database
    students.append(Student(1, 'John Doe', '1234567890', '01-01-2000'))
    students.append(Student(2, 'Jane Smith', '0987654321', '02-02-2000'))
    
    # Display students
    display_students(students)

    # Save to file
    save_to_file(students, 'students_info.json')

if __name__ == "__main__":
    main()