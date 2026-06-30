' RAVANON — Demo modu: Admin ac + ornek siparis bildirimi
Option Explicit

Dim shell, fso, root, adminUrl, i, maxWait

Set shell = CreateObject("WScript.Shell")
Set fso   = CreateObject("Scripting.FileSystemObject")

root     = fso.GetParentFolderName(WScript.ScriptFullName)
adminUrl = "http://localhost:3000/admin?demo=1"
maxWait  = 35

If Not ServerReady("http://localhost:3000/admin/login") Then
    shell.Run "wscript.exe //B """ & root & "\admin\Baslat-Admin.vbs""", 0, False
    For i = 1 To maxWait
        WScript.Sleep 1000
        If ServerReady("http://localhost:3000/admin/login") Then Exit For
    Next
End If

If ServerReady("http://localhost:3000/admin/login") Then
    shell.Run adminUrl, 1, False
Else
    MsgBox "Admin panel baslatilamadi." & vbCrLf & "Once KURULUM.bat calistirin.", vbExclamation, "RAVANON Demo"
End If

WScript.Quit 0

Function ServerReady(checkUrl)
    On Error Resume Next
    Dim http
    ServerReady = False
    Set http = CreateObject("MSXML2.ServerXMLHTTP.6.0")
    If http Is Nothing Then Set http = CreateObject("MSXML2.XMLHTTP")
    http.Open "GET", checkUrl, False
    http.setTimeouts 2000, 2000, 2000, 2000
    http.Send
    If Err.Number = 0 Then ServerReady = (http.Status >= 200 And http.Status < 500)
    On Error GoTo 0
End Function