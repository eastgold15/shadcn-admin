import type { SubmitEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { ConfirmDialog } from "./confirm-dialog";

describe("ConfirmDialog", () => {
  it("renders title, description, and default buttons", async () => {
    const { getByRole, getByText } = await render(
      <ConfirmDialog
        desc="This action cannot be undone."
        handleConfirm={vi.fn()}
        onOpenChange={vi.fn()}
        open
        title="Delete item"
      />
    );

    await expect
      .element(getByRole("heading", { name: "Delete item" }))
      .toBeInTheDocument();
    await expect
      .element(getByText("This action cannot be undone."))
      .toBeInTheDocument();
    await expect
      .element(getByRole("button", { name: "Cancel" }))
      .toBeInTheDocument();
    await expect
      .element(getByRole("button", { name: "Continue" }))
      .toBeInTheDocument();
  });

  it("calls handleConfirm when the confirm button is clicked", async () => {
    const handleConfirm = vi.fn();
    const { getByRole } = await render(
      <ConfirmDialog
        confirmText="Sign out"
        desc="Are you sure?"
        handleConfirm={handleConfirm}
        onOpenChange={vi.fn()}
        open
        title="Sign out"
      />
    );

    await userEvent.click(getByRole("button", { name: "Sign out" }));
    expect(handleConfirm).toHaveBeenCalledOnce();
  });

  it("disables confirm when disabled is true", async () => {
    const handleConfirm = vi.fn();
    const { getByRole } = await render(
      <ConfirmDialog
        desc="..."
        disabled
        handleConfirm={handleConfirm}
        onOpenChange={vi.fn()}
        open
        title="Danger"
      />
    );

    const confirm = getByRole("button", { name: "Continue" });
    await expect.element(confirm).toBeDisabled();
    expect(handleConfirm).not.toHaveBeenCalled();
  });

  it("when isLoading is true, disables cancel and confirm", async () => {
    const handleConfirm = vi.fn();
    const { getByRole } = await render(
      <ConfirmDialog
        desc="..."
        handleConfirm={handleConfirm}
        isLoading
        onOpenChange={vi.fn()}
        open
        title="Loading"
      />
    );

    await expect
      .element(getByRole("button", { name: "Cancel" }))
      .toBeDisabled();
    await expect
      .element(getByRole("button", { name: "Continue" }))
      .toBeDisabled();
  });

  it("supports custom button texts", async () => {
    const { getByRole } = await render(
      <ConfirmDialog
        cancelBtnText="No"
        confirmText="Yes"
        desc="..."
        handleConfirm={vi.fn()}
        onOpenChange={vi.fn()}
        open
        title="Delete"
      />
    );

    await expect
      .element(getByRole("button", { name: "No" }))
      .toBeInTheDocument();
    await expect
      .element(getByRole("button", { name: "Yes" }))
      .toBeInTheDocument();
  });

  it("renders confirm as submit button linked to desc form when `form` is set", async () => {
    const { getByRole } = await render(
      <ConfirmDialog
        confirmText="Delete"
        desc={
          <form className="space-y-4" id="tasks-multi-delete-form">
            <p>Type DELETE to confirm.</p>
          </form>
        }
        desc={
          <form className="space-y-4" id="tasks-multi-delete-form">
            <p>Type DELETE to confirm.</p>
          </form>
        }
        destructive
        form="tasks-multi-delete-form"
        open
        title="Delete tasks"
      />
    );

    const deleteBtn = getByRole("button", { name: "Delete" });
    await expect.element(deleteBtn).toHaveAttribute("type", "submit");
    await expect
      .element(deleteBtn)
      .toHaveAttribute("form", "tasks-multi-delete-form");
  });

  it("submits the desc form when confirm is clicked (form prop, no handleConfirm)", async () => {
    const handleFormSubmit = vi.fn((e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
    });

    const { getByRole } = await render(
      <ConfirmDialog
        confirmText="Delete"
        desc={
          <form
            className="space-y-4"
            id="users-delete-form"
            onSubmit={handleFormSubmit}
          >
            <p>Confirm deletion.</p>
          </form>
        }
        destructive
        form="users-delete-form"
        onOpenChange={vi.fn()}
        open
        title="Delete"
      />
    );

    await userEvent.click(getByRole("button", { name: "Delete" }));

    expect(handleFormSubmit).toHaveBeenCalledOnce();
  });

  it("submits the form when Enter key is pressed", async () => {
    const handleFormSubmit = vi.fn((e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
    });

    const { getByPlaceholder } = await render(
      <ConfirmDialog
        confirmText="Delete"
        desc={
          <form
            className="space-y-4"
            id="users-delete-form"
            onSubmit={handleFormSubmit}
          >
            <input name="username" placeholder="username" type="text" />
          </form>
        }
        destructive
        form="users-delete-form"
        onOpenChange={vi.fn()}
        open
        title="Delete"
      />
    );

    await userEvent.fill(getByPlaceholder("username"), "test");
    await userEvent.keyboard("{Enter}");
    expect(handleFormSubmit).toHaveBeenCalledOnce();
  });

  it("does not submit the form when confirm is disabled (typed confirmation mismatch)", async () => {
    const handleFormSubmit = vi.fn((e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
    });

    const { getByRole } = await render(
      <ConfirmDialog
        confirmText="Delete"
        desc={
          <form id="users-delete-form" onSubmit={handleFormSubmit}>
            <p>Enter username to enable Delete.</p>
          </form>
        }
        destructive
        disabled
        form="users-delete-form"
        onOpenChange={vi.fn()}
        open
        title="Delete"
      />
    );

    const deleteBtn = getByRole("button", { name: "Delete" });
    await expect.element(deleteBtn).toBeDisabled();
    expect(handleFormSubmit).not.toHaveBeenCalled();
  });
});
