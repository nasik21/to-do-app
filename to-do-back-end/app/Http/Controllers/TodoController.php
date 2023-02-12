<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Todo::all();

        if (isset($data) && !empty($data)) {
            return response()->json(['status' => true, 'message' => 'task get success', 'data' => $data])->setStatusCode(200);
        }
        return response()->json(['status' => false, 'message' => 'error while get task'])->setStatusCode(400);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    { 
        $validator = Validator::make($request->all(), [
            'task' => 'required|string', 
        ]);

        if ($validator->fails()) {
            $error = $validator->errors()->first();
            return response()->json(['status' => false, 'message' => $error])->setStatusCode(400);
        }
        
        $input['task'] = $request->task;  
        $input['user_id'] = Auth::id();
    
        Todo::create($input);
        return response()->json(['status' => true, 'message' => 'task add success'])->setStatusCode(200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $data = Todo::find($id);

            if (isset($data) && !empty($data)) {
                return response()->json([
                    'status' => true, 
                    'message' => 'task get success', 
                    'data' => $data]
                    )
                ->setStatusCode(200);
            }
            return response()->json(['status' => false, 'message' => 'error while get task'])->setStatusCode(400);
        } catch (\Exception $ex) {
            Log::info("TaskClassClass Error", ["getTask" => $ex->getMessage(), "line" => $ex->getLine()]);
            return response()->json(['status' => false, 'message' => 'internal server error'])->setStatusCode(500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function edit(Todo $todo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Todo $todo)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'task' => 'required|string',            
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            $error = $validator->errors()->first();
            return response()->json(['status' => false, 'message' => $error])->setStatusCode(400);
        }

            
        $todo = Todo::find($request->id);
        $todo->task = $request->task;
        $todo->status = $request->status;
        $todo->save();

        return response()->json(['status' => true, 'message' => 'task updated success'])->setStatusCode(200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Todo::where('id', $id)->delete();

        return response()->json(['status' => true, 'message' => 'task delete success'])->setStatusCode(200);    
    }
}
