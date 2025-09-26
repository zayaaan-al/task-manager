async function getTasks() {
  try {
    const res = await fetch("http://localhost:3008/getTasks");
    const data = await res.json();

    const tableBody = document.getElementById("taskTable");

    if (!data || data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="empty">No tasks found</td></tr>`;
      return;
    }

    const str = data.map(task => `
      <tr>
        <td><input type="text" id="title-${task._id}" value="${task.title}" disabled></td>
        <td><input type="text" id="desc-${task._id}" value="${task.description}" disabled></td>
        <td><input type="date" id="due-${task._id}" value="${task.dueDate}" disabled></td>
        <td>
          <select id="status-${task._id}" disabled>
            <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
          </select>
        </td>
        <td>
          <button class="edit-btn" onClick="handleEdit('${task._id}')">Edit</button>
          <button class="delete-btn" onClick="handleDelete('${task._id}')">Delete</button>
          <button class="save-btn" onClick="handleSave('${task._id}')">Save</button>
        </td>
      </tr>
    `).join("");

    tableBody.innerHTML = str;
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
}

getTasks();

async function handleDelete(id) {
  const res = await fetch('http://localhost:3008/deleteTask', {
    method: "DELETE",
    headers: { "Content-Type": "text/plain" },
    body: id
  });
  const data = await res.text();
  if (data === "success") {
    alert("Task deleted");
    getTasks();
  } else {
    alert("Deletion failed");
  }
}

async function handleEdit(id) {
  document.getElementById(`title-${id}`).disabled = false;
  document.getElementById(`desc-${id}`).disabled = false;
  document.getElementById(`due-${id}`).disabled = false;
  document.getElementById(`status-${id}`).disabled = false;
}

async function handleSave(id) {
  const title = document.getElementById(`title-${id}`).value;
  const desc = document.getElementById(`desc-${id}`).value;
  const dueDate = document.getElementById(`due-${id}`).value;
  const status = document.getElementById(`status-${id}`).value;

  const data = { id, title, description: desc, dueDate, status };

  const res = await fetch("http://localhost:3008/updateTask", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.text();
  if (result === "success") {
    alert("Task updated");
    getTasks();
  } else {
    alert("Update failed");
  }
}
