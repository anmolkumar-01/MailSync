import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Keep this import
import { Paperclip, Send, Sparkles, FileText } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../ui/dialog";
import { Textarea } from "../ui/textarea";

const ComposeAndSend = () => {
  const { selectedEmails } = useAppStore();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(""); // Stores HTML content from the editor
  const [attachment, setAttachment] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleGenerateWithAI = () => {
    const generatedText = `<p>This is an AI-generated email based on the prompt: "<strong>${aiPrompt}</strong>".</p><p>Please review and edit it to fit your needs.</p>`;
    setBody(generatedText);
    setIsAiModalOpen(false);
    setAiPrompt("");
  };

  const handleSendEmail = async () => {
    const plainTextBody = new DOMParser().parseFromString(body, 'text/html').body.textContent || "";
    if (selectedEmails.length === 0 || !subject || !plainTextBody.trim()) {
      alert("Please select recipients, and provide a subject and body.");
      return;
    }
    setIsSending(true);

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('body', body); // Send the full HTML content
    formData.append('recipients', JSON.stringify(selectedEmails));
    if (attachment) {
      formData.append('attachment', attachment);
    }

    console.log("--- Sending Email Data (HTML Body) ---");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      alert(`Email successfully dispatched to ${selectedEmails.length} recipients! (Mock API)`);
      setSubject("");
      setBody("");
      setAttachment(null);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("An error occurred while sending the email.");
    } finally {
      setIsSending(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <>
      <Card className="h-full flex flex-col shadow-md border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <span className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-blue-500 text-white">3</span>
            <span className="text-blue-900">Compose & Send</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Write your email, use AI for assistance, and send it.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col gap-4">
          <div className="space-y-1">
            <Button variant="outline" size="sm" onClick={() => setIsAiModalOpen(true)} className="text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700">
              <Sparkles className="mr-2 h-4 w-4" />
              Ask AI to write
            </Button>
          </div>
          <div className="space-y-1">
            <label htmlFor="subject" className="text-sm font-medium text-blue-900">Subject</label>
            <Input id="subject" placeholder="Your email subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="border-blue-200"/>
          </div>
          <div className="space-y-1 flex-grow flex flex-col">
            <label className="text-sm font-medium text-blue-900">Body</label>
            {/* The wrapper div is the key change for robust styling */}
            <div className=" flex-grow h-[250px] rounded-md border border-blue-200 bg-white"
            spellCheck="false">
              <ReactQuill
                theme="snow"
                value={body}
                onChange={setBody}
                modules={quillModules}
                placeholder="Write your email content here..."
                style={{ height: 'calc(100% - 42px)' }} // Adjust height to fit within the wrapper
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-blue-100 pt-4">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <label htmlFor="attachment-input" className="cursor-pointer text-gray-500 hover:text-blue-600">
                <Paperclip className="h-5 w-5" />
              </label>
            </Button>
            <input id="attachment-input" type="file" className="hidden" onChange={(e) => setAttachment(e.target.files[0])} />
            {attachment && (
              <span className="text-xs text-gray-600 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-500" />
                {attachment.name}
              </span>
            )}
          </div>
          <Button onClick={handleSendEmail} disabled={isSending || selectedEmails.length === 0} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Send className="mr-2 h-4 w-4" />
            {isSending ? "Sending..." : `Send to ${selectedEmails.length} recipients`}
          </Button>
        </CardFooter>
      </Card>

      {/* AI Generation Modal */}
      <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-blue-900">Generate Email with AI</DialogTitle>
            <DialogDescription>
              Describe the purpose of your email, and our AI will draft it for you.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="e.g., A welcome email for new subscribers..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="min-h-[100px] border-blue-200"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleGenerateWithAI} className="bg-blue-500 hover:bg-blue-600 text-white">
               <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComposeAndSend;