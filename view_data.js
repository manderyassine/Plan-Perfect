// Switch to task-manager database
use task-manager

// View all users
print("\nUsers in the database:")
db.users.find().pretty()

// View all tasks
print("\nTasks in the database:")
db.tasks.find().pretty()
